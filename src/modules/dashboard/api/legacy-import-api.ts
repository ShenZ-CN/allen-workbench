import{getSupabase}from"@/lib/supabase";
export async function importLegacyBackup(file:File){const payload=JSON.parse(await file.text());const{data,error}=await getSupabase().functions.invoke("import-legacy-data",{body:payload});if(error)throw error;return data as{import_run_id:string;summary:Record<string,number>}}
