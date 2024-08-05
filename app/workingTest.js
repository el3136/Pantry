'use client'

import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import db from "../firebase.js";
// import { db } from "../firebase.js";


const item = ['tomato', 'potato', 'onion', 'garlic', 'ginger', 'celery', 'carrot', 'lettuce', 'kale', 'cucumber' , 'bread']

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};


export default function Home() {
  const [pantry, setPantry] = useState([])

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [itemName, setItemName] = useState('')

  const updatePantry = async () => {
    const snapshot = query(collection(db, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      // console.log(doc.id, doc.data())
      pantryList.push(doc.id)
    })
    console.log(pantryList)
    setPantry(pantryList)
  }

  useEffect(() => {
    // console.log(db.type)
    // console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
    updatePantry()
  }, [])

  const addItem = async (item) => {
    // console.log(item)
    const docRef = doc(collection(db, 'pantry'), item)
    await setDoc(docRef, {})
    await updatePantry()
  }
  
  const removeItem = async(item) => {
    const docRef = doc(collection(db, 'pantry'), item)
    await deleteDoc(docRef)
    await updatePantry()
  }

  return ( <Box width="100vw" height="100vh"
    display={"flex"}
    justifyContent={"center"}
    flexDirection={"column"}
    alignItems={"center"}
    gap={2}
  >
    <Button variant="contained" onClick={handleOpen}>Add Pantry Item</Button>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic" 
              label="Item" 
              variant="outlined" 
              fullWidth 
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }} >Add</Button>
          </Stack>
          
        </Box>
      </Modal>

    <Box border={"1px solid #333"}>
      <Box
        width="800px"
        height="100px"
        bgcolor={'#ADD8E6'}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}>
        <Typography variant="h2" color={"#333"} textAlign={"center"}>
          Pantry Items
        </Typography>
        

      </Box>
      <Stack width="800px" height="300px" spacing={2} overflow={"auto"}>
        {pantry.map((i) => (
          <Box
            key={i}
            width="100%" 
            height="300px" 
            display={"flex"} 
            justifyContent={'space-between'} 
            alignItems={'center'} 
            bgcolor={'#f0f0f0'}
            padding={5}
          >
            <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
              {
              i.charAt(0).toUpperCase() + i.slice(1)
              }
            </Typography>

            <Button variant="contained" onClick={() => removeItem(i)}>Remove</Button>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>
  );
}
