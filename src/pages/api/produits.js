import { getSession } from 'next-auth/client';

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session) return res.status(401).text('unauthorized');

  res.json({ ok: true });

  // const db = new PouchDB('.db/produits');

  // if (req.method === 'GET') {
  //   console.log('Get Produits');
  //   const docs = await db.allDocs({ include_docs: true });
  //   res.json(docs.rows.map((d) => ({ code: d.doc.code, name: d.doc.name })));
  // } else if (req.method === 'POST') {
  //   const { action } = req.body;
  //   if (action === 'add') {
  //     const doc = req.body.doc;
  //     console.log(`Add Produit ${doc.code}`);
  //     res.json(await db.put({ ...doc, _id: doc.code }));
  //   } else if (action === 'delete') {
  //     console.log(`Delete Produit ${req.body.code}`);
  //     const doc = await db.get(req.body.code);
  //     console.log(doc);
  //     res.json(await db.remove(doc));
  //   } else {
  //     res.status(400).json({ error: 'invalid action' });
  //   }
  // } else {
  //   res.status(400).json({ error: 'invalid method' });
  // }
};
