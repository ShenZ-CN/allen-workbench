import{getSupabase}from"@/lib/supabase";
export async function askAllen(question:string){const{data,error}=await getSupabase().functions.invoke("ai-query",{body:{question}});if(error)throw error;return data as{answer:string;sources:Array<{id:string;title:string;category:string}>}}
