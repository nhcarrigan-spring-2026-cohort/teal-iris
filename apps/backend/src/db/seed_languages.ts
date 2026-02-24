import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "./schema.js";
import { languages } from "./schema.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool, { schema });

const languageData = [
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycanca" },
  { code: "be", name: "Belarusian", nativeName: "Беларуская" },
  { code: "bg", name: "Bulgarian", nativeName: "Български" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski" },
  { code: "ca", name: "Catalan", nativeName: "Català" },
  { code: "cs", name: "Czech", nativeName: "Čeština" },
  { code: "cy", name: "Welsh", nativeName: "Cymraeg" },
  { code: "da", name: "Danish", nativeName: "Dansk" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά" },
  { code: "en", name: "English", nativeName: "English" },
  { code: "eo", name: "Esperanto", nativeName: "Esperanto" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "et", name: "Estonian", nativeName: "Eesti" },
  { code: "fa", name: "Persian", nativeName: "فارسی" },
  { code: "fi", name: "Finnish", nativeName: "Suomi" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge" },
  { code: "he", name: "Hebrew", nativeName: "עברית" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ka", name: "Georgian", nativeName: "ქართული" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақша" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
  { code: "nb", name: "Norwegian Bokmål", nativeName: "Norsk bokmål" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ro", name: "Romanian", nativeName: "Română" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina" },
  { code: "sq", name: "Albanian", nativeName: "Shqip" },
  { code: "sr", name: "Serbian", nativeName: "Српски" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
];

async function seed() {
  console.log("🌱 Seeding ISO languages...");
  try {
    await db
      .insert(languages)
      .values(languageData)
      .onConflictDoUpdate({
        target: languages.code,
        set: {
          name: sql`EXCLUDED.name`,
          nativeName: sql`EXCLUDED.native_name`,
        },
      });
    console.log("✅ Languages seeded!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await pool.end();
  }
}

seed();
