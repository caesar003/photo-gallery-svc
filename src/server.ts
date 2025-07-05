import app from "./app";

const port = process.env.PORT || 3422;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
