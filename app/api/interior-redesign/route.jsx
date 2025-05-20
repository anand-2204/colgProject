import { NextResponse } from "next/server";
import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
import axios from "axios";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import { AiGeneratedImage } from "@/config/schema";
import { db } from "@/config/db";
import {OpenAI} from 'openai';



// const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_TOKEN });


const replicate = new Replicate({
    auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN
});
export async function POST(req) {
    //const {user} = useUser();
    const {imageUrl, type, lifestyle, style, lighting, storages, furniture, mood, smart, sustainability, rental, budget, additional, userEmail} = await req.json();
    
    try{
        const input = {
            image: imageUrl,
            prompt: 'A '+type+' with a '+style+' space and a '+mood+' ambiance and aligns with a '+lifestyle+' lifestyle, incorporating '+(smart ? "smart home technology" : "traditional")+' elements and focuses on '+lighting+' lighting and optimize storage with '+storages+' solutions and focuses on '+furniture+' furniture while considering '+(sustainability ? "eco-friendly materials" : "standard materials")+' and is '+(rental ? "renter-friendly" : "customized for ownership")+' and fits within a '+budget+' budget and with additional requirements of '+additional,
        };
        
        // const response = await openai.images.generate({
        //     prompt,
        //     n: 1,
            
        //   });
      
        //   const output = response.data[0].url;

        //   res.json(output);
      





        const output = await replicate.run("adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38", { input });
        
        //await writeFile("output.png", output);
        //return NextResponse.json({result:output})
        //const output="https://replicate.delivery/xezq/MLuEOODEH7p5EtW4DPRx0q00f7tf2TvpIsigGSEB6fTVDfnRB/out.png"
        const base64Image=await ConvertImageToBase64(output);
        const fileName = Date.now()+'.png';
        const storageRef = ref(storage, 'interior-redesign/'+fileName);
        await uploadString(storageRef, base64Image, 'data_url');
        const downloadUrl = await getDownloadURL(storageRef);
        console.log(downloadUrl);
        //return NextResponse.json({'result':downloadUrl});
        const dbResult = await db.insert(AiGeneratedImage).values({
            type: type,
            style: style,
            lighting: lighting,
            storages: storages,
            furniture: furniture,
            mood: mood,
            smart: smart,
            sustainability: sustainability,
            rental: rental,
            budget: budget,
            additional: additional,
            orgImage: imageUrl,
            aiImage: downloadUrl,
            userEmail: userEmail,
        }).returning({id: AiGeneratedImage.id});
        console.log(dbResult);
        return NextResponse.json({'result':downloadUrl});
    } catch(e){
        return NextResponse.json({error:e})
    }

}

async function ConvertImageToBase64(imageUrl){
    const resp = await axios.get(imageUrl, {responseType:'arraybuffer'});
    const base64ImageRaw=Buffer.from(resp.data).toString('base64');
    return "data:image/png;base64,"+base64ImageRaw;
}