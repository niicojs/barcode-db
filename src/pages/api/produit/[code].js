import nextConnect from 'next-connect';
import middleware from '../../../middlewares/database';
import { find } from '../../../upcdb';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  const code = req.query.code;
  console.log(`Get Produit ${code}`);
  const results = await req.db
    .collection('barcode')
    .find({ code }, { _id: 0 })
    .sort({ modified: -1 })
    .toArray();

  if (results.length === 0) {
    // fallback to UPC Database
    console.log('fallback to UPC DB');
    const info = await find(code);
    if (info) {
      info.createdAt = new Date();
      info.modifiedAt = new Date();
      await req.db.collection('barcode').insertOne(info);
      results.push(info);
    }
  }

  res.json(results);
});

handler.post(async (req, res) => {
  const code = req.query.code;
  console.log(`Update Produit ${code}`);
  try {
    const result = await req.db
      .collection('barcode')
      .update(
        { code },
        {
          $set: { name: req.body.name },
          $currentDate: { modifiedAt: true },
        },
        { upsert: true }
      );
    console.log(result);
    res.json({ ok: true });
  } catch (e) {
    console.log(e);
    res.json({ ok: false, error: e.message });
  }
});

export default handler;
