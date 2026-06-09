const url = 'https://dpdhujdltumlcftbugvr.supabase.co/rest/v1/';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwZGh1amRsdHVtbGNmdGJ1Z3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjMwMjUsImV4cCI6MjA5NjEzOTAyNX0.7Ayuq2Akmnk03UngLcS3Qwe8WaJJJMcq3JGTiAfVBXs';
const tables = ['shopping_lists','shopping_list_items','stores'];
(async () => {
  for (const t of tables) {
    const res = await fetch(url + t + '?select=*&limit=1', {
      headers: { apikey: key, Authorization: 'Bearer ' + key, accept: 'application/json' }
    });
    const body = await res.text();
    console.log('TABLE', t, 'status', res.status, 'body', body);
  }
})();
