"use client"
import React, { useContext, useState } from 'react'
import ImageSelection from './_components/ImageSelection'
import Type from './_components/Type'
import Style from './_components/Style'
import Mood from './_components/Mood'
import Furniture from './_components/Furniture'
import Lifestyle from './_components/Lifestyle'
import Lighting from './_components/Lighting'
import Storage from './_components/Storage'
import Smart from './_components/Smart'
import Sustainability from './_components/Sustainability'
import Rental from './_components/Rental'
import Budget from './_components/Budget'
import Additional from './_components/Additional'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/config/firebaseConfig'
import { useUser } from '@clerk/nextjs'
import CustomLoading from './_components/CustomLoading'
import AiOutputDialog from '../_components/AiOutputDialog'
import { db } from '@/config/db'
import { Users } from '@/config/schema'
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { eq } from 'drizzle-orm'

function CreateNew() {
  const { user } = useUser();
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiOutputImage, setAiOutputImage] = useState();
  const [openOutputDialog, setOpenOutputDialog] = useState(false);
  const [orgImage, setOrgImage] = useState();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  //const [outputResult, setOutputResult] = useState();
  const onHandleInputChange = (value, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
    console.log(formData);
  }

  /*useEffect(() => {
    console.log(formData);
  }, [formData]); */


  const GenerateAiImage = async () => {
    if (userDetail?.credits < 1) {
      alert('You do not have enough credits! Please purchase more.');
      return;
    }
    setLoading(true);
    try {
      const rawImageUrl = await SaveRawImageToFirebase();
      const result = await axios.post('/api/interior-redesign', {
        imageUrl: rawImageUrl,
        type: formData?.type,
        lifestyle: formData?.lifestyle,
        style: formData?.style,
        lighting: formData?.lighting,
        storages: formData?.storages,
        furniture: formData?.furniture,
        mood: formData?.mood,
        smart: formData?.smart,
        sustainability: formData?.sustainability,
        rental: formData?.rental,
        budget: formData?.budget,
        additional: formData?.additional,
        userEmail: user?.primaryEmailAddress?.emailAddress
      });
      console.log(result.data);
      await updateUserCredits();
      setAiOutputImage(result.data.result);
      setOpenOutputDialog(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const SaveRawImageToFirebase = async () => {
    const fileName = Date.now() + '_raw.png';
    const imageRef = ref(storage, 'room-interior-design/' + fileName)
    await uploadBytes(imageRef, formData.image).then(resp => {
      console.log('File uploaded...')
    })

    const downloadUrl = await getDownloadURL(imageRef);
    console.log(downloadUrl);
    setOrgImage(downloadUrl);
    return downloadUrl;

  }

  /**
   * Update credits
   * @returns 
   */
  const updateUserCredits = async () => {
    try {
      const result = await db.update(Users)
        .set({
          credits: userDetail?.credits - 1
        })
        .where(eq(Users.clerkUserId, user?.id))
        .returning({ id: Users.id });
  
      if (result.length > 0) {
        setUserDetail(prev => ({
          ...prev,
          credits: userDetail?.credits - 1
        }));
        return result[0].id;
      }
    } catch (error) {
      console.error("Error updating credits:", error);
      throw error;
    }
  }

  return (
    <div>
      <h2 className='font-bold text-3xl text-primary text-center '>Remodel Any Interior With the Magic of AI</h2>
      <p className='text-center text-gray-500'>Transform any interior with a click. Choose any option below based on type, style, mood, budget, etc, and watch as AI instantly reimagines your interior</p>

      <div className='grid grid-cols-1 md:grid-cols-2 mt-10 gap-10'>
        <ImageSelection selectedImage={(value) => onHandleInputChange(value, 'image')} />
        <div>
          <Type selectedType={(value) => onHandleInputChange(value, 'type')} />
          <Lifestyle selectedLifestyle={(value) => onHandleInputChange(value, 'lifestyle')} />
          <Style selectedStyle={(value) => onHandleInputChange(value, 'style')} />
          <div className='grid grid-cols-2 gap-10 w-full'>
            <Lighting selectedLighting={(value) => onHandleInputChange(value, 'lighting')} />
            <Storage selectedStorage={(value) => onHandleInputChange(value, 'storages')} />
          </div>
          <div className='grid grid-cols-2 gap-10 w-full'>
            <Furniture selectedFurniture={(value) => onHandleInputChange(value, 'furniture')} />
            <Mood selectedMood={(value) => onHandleInputChange(value, 'mood')} />
          </div>
          <div className='grid grid-cols-3 gap-3 w-full'>
            <Smart selectedSmart={(value) => onHandleInputChange(value, 'smart')} />
            <Sustainability selectedSustainability={(value) => onHandleInputChange(value, 'sustainability')} />
            <Rental selectedRental={(value) => onHandleInputChange(value, 'rental')} />
          </div>
          <Budget selectedBudget={(value) => onHandleInputChange(value, 'budget')} />
          <Additional additionalInput={(value) => onHandleInputChange(value, 'additional')} />
          {/* Button */}
          <Button className='w-full mt-5 ' onClick={GenerateAiImage} disabled={userDetail?.credits < 1 || !formData.image || !formData.type || !formData.style || !formData.lifestyle}>Generate</Button>
          {userDetail?.credits < 1 ? (
            <p className='text-red-500 text-sm mt-2 mb-10'>
              You don't have enough credits. Please purchase more.
            </p>
          ) : (
            <p className='text-sm text-gray-400 mt-2 mb-10'>
              NOTE: 1 Credit will be used to remodel your interior
            </p>
          )}
        </div>
      </div>
      <CustomLoading loading={loading} />
      <AiOutputDialog openDialog={openOutputDialog} closeDialog={() => setOpenOutputDialog(false)} orgImage={orgImage} aiImage={aiOutputImage} />
    </div>
  )
}

export default CreateNew