import attributeRouter from "./attribute";
import attributeValueRouter from "./attributeValue";
import authRouter from "./auth";
import cartRouter from "./cart";
import orderRouter from "./order";
import productRouter from "./product";

const routers = (app) => {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  app.use("/", authRouter);
  app.use("/api/products", productRouter);
  app.use("/api/attributes", attributeRouter);
  app.use("/api/attribute-values", attributeValueRouter);
  app.use("/orders", orderRouter);


};

export default routers;
