import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const SUPABASE_URL = "https://dpdhujdltumlcftbugvr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwZGh1amRsdHVtbGNmdGJ1Z3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjMwMjUsImV4cCI6MjA5NjEzOTAyNX0.7Ayuq2Akmnk03UngLcS3Qwe8WaJJJMcq3JGTiAfVBXs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
