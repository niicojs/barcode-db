import { getSession } from 'next-auth/client';
import nextConnect from 'next-connect';
import middleware from '../../../middlewares/database';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  const session = await getSession({ req });
  if (!session) return res.statusCode(401).send('unauthorized');

  const results = await req.barcodes
    .find(
      {
        $text: { $search: req.query.text },
      },
      { _id: 0 }
    )
    .sort({ modified: -1 })
    .toArray();
  res.json(results);
});

export default handler;
