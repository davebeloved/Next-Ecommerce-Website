import { getToken } from "next-auth/jwt";
import Product from "../../models/Product";
import db from "../../utils/db";

const handler = async (req, res) => {
  const { method } = req;
  await db.connect();

  const user = await getToken({ req });
  if (!user || !user.isAdmin) {
    return res.status(401).send("admin signin required");
  }

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    try {
      const products = await Product.create(req.body);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  if (method === "PUT") {
    const {
      name,
      brand,
      oldPrice,
      price,
      image,
      category,
      slug,
      description,
      countInStock,
      _id,
    } = req.body;
    await Product.updateOne(
      { _id },
      {
        name,
        brand,
        oldPrice,
        price,
        image,
        category,
        slug,
        description,
        countInStock,
      }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
};

export default handler;
