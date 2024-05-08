import { readFileSync, watchFile } from "fs";
import { z } from "zod";

const THEME_FILE = "dark.json";

// schema
const colorName = z.enum(["primary", "secondary", "third"]);
const colorValue = z.tuple([
  z.number().gte(0).lte(360).describe("h"),
  z.number().gte(0).lte(100).describe("s"),
  z.number().gte(0).lte(100).describe("l"),
]);
const themeSchema = z.record(colorName, colorValue);
type Theme = z.infer<typeof themeSchema>;

function readAndValidate() {
  const data = readFileSync(THEME_FILE, "utf8");
  const dataJSON = JSON.parse(data);

  const result = themeSchema.safeParse(dataJSON);
  if (!result.success) {
    console.error("Theme failed validation with followin errors:");
    result.error.errors.forEach((item) => {
      console.error(item.message);
    });
  } else {
    console.log(result.data);
  }
}

readAndValidate();

// watchFile(
//   THEME_FILE,
//   {
//     // Passing the options parameter
//     bigint: false,
//     persistent: true,
//     interval: 1000,
//   },
//   (curr, prev) => {
//     console.log("File was modified at: ", prev.mtime);
//     console.log("File was again modified at: ", curr.mtime);

//     readAndValidate();
//   }
// );
