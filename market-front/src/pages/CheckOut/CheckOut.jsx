import React, { act, useState } from 'react'
import AdressForm from './AdressForm';
import { useDispatch } from 'react-redux'
import { FormProvider, useForm } from 'react-hook-form'
import requests from '../../api/ApiClient';
import { clearCart } from '../cart/cartSlice';
import { Box, Button, CircularProgress, Grid, Paper, Step, StepLabel, Stepper } from '@mui/material';
import Info from './Info';
import { ChevronLeftRounded, ChevronRightRounded } from '@mui/icons-material';
import PaymentForm from './PaymentForm';
import Review from './Review';
import { router } from '../../App';


const steps = ["Teslimat Bilgileri","Ödeme","Sipariş Özeti"];

const getStepContent = (step) => {
  switch(step){
    case 0:
      return <AdressForm/>      
    case 1:
      return <PaymentForm/>
    case 2:
      return <Review/>
    default : 
      throw new Error("Bilinmeyen adım")
  }
}

const CheckOut = () => {
  const [activeStep,setActiveStep] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [orderId,setOrderId] = useState(0);
  const [loading,setLoading] = useState(false);
  const dispatch = useDispatch()
  const methods = useForm()
  function handlePreview(){
    setActiveStep(activeStep-1);
  }

  async function handleNext(data){
    if(activeStep == 2){
      setLoading(true);
      try{
      const payload = {
        address: {
          address: data.adress,
          city: data.city,
          district: data.district,
          phone: data.phone
        },
        cartInfo: {
          cartname: data.cartname,
          cartnumber: data.cartnumber,
          expirydate: data.expirydate,
          cvv: data.cvv
        }
      };        
        const result = await requests.orders.createOrder(payload);
        setOrderId(result.orderId)
        setActiveStep(activeStep+1);
        dispatch(clearCart());
        router.navigate('/')
      }
      catch(err){
        console.log(err);
      }
      finally{
        setLoading(false)
      }
      }
      else{
        setActiveStep(activeStep+1)
      }
  }
  return (
    <FormProvider {...methods}>
      <Paper>
        <Grid container spacing={3}>
          { activeStep !== steps.length &&
            <Grid
            size={4}
            sx={{p:3,borderRight:'1px solid',borderColor:"divider"}}
            >
              <Info/>
            </Grid>
          }
          <Grid size={activeStep !== steps.length ? 8 : 12}>
            <Stepper activeStep={activeStep} sx={{height:40,mb:4}}>
              {
                steps.map((label)=>(
                  <Step key={label} sx={{color : "purple"}}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))
              }
            </Stepper>
            {activeStep === steps.length ? 
            (
              <p>İşlem Tamamlandı</p>
            )
            :
            (
              <form onSubmit={methods.handleSubmit(handleNext)}>
                {getStepContent(activeStep)}
                <Box sx={{
                  display:"flex",
                  justifyContent:activeStep !== 0 ? "space-between" : "flex-end"
                }}
                >
                  {activeStep != 0 &&
                    <Button
                      onClick={handlePreview}
                      startIcon={<ChevronLeftRounded/>}
                      variant='contained'
                      color='purple'
                    >
                      Geri
                    </Button>
                  }
                  {
                    <Button
                      type='submit'
                      startIcon={<ChevronRightRounded/>}
                      variant='contained'
                      color='blue'
                    >
                      {
                        loading ? 
                        (
                          <CircularProgress size={25}/>
                        )
                        :
                        (
                          activeStep === 2 ? "Siparişi tamamla" : "İlerle"
                        )
                      }
                    </Button>
                  }
                </Box>
              </form>
            )
            }
          </Grid>
        </Grid>
      </Paper>
    </FormProvider>
  )
}

export default CheckOut
