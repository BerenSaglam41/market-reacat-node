import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux'
import { currenyTRY } from '../../utils/formats';

const Info = () => {
  const { cart } = useSelector(state=>state.cart);

  const subTotal = cart?.reduce(
    (toplam, item) => toplam + item.price * item.quantity,
    0
  ) || 0;
  
  const tax = subTotal * 0.2;
  const total = subTotal + tax;

  return (
    <>
      <Typography variant='subtitle2' color={{color:"text.secondary"}}>
        Toplam
      </Typography>
      <Typography variant='h5'>
        {
          currenyTRY.format(total)
        }
      </Typography>
      <List>
        {cart?.map((item)=>(
          <ListItem key={item.productId} sx={{py:1,px:0}}>
            <ListItemAvatar>
              <Avatar 
                variant='square' 
                src={item.image ? `${import.meta.env.VITE_API_BASE_URL || 'https://market-reacat-node-production.up.railway.app'}/uploads/${item.image}` : '/placeholder.png'}
              >
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={item.name} secondary={`x${item.quantity}`}>
            </ListItemText>
            <Typography variant='body1'>
              {currenyTRY.format(item.price)}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default Info
