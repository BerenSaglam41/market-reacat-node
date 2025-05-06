import { Grid, TextField } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'

const AdressForm = () => {
  const {register,formState : {errors}} = useFormContext()
  return (
    <Grid container spacing={3}>
      <Grid size={{xs:12,md:6}}>
        <TextField
        {
          ...register("city",{
            required : "City Zorunlu Alan",
          })
        }
          label = "Enter city"
          size='small'
          fullWidth
          autoFocus
          sx={{mb:2}}
          error={!!errors.city}
        />
      </Grid>
      <Grid size={{xs:12,md:6}}>
        <TextField
        {
          ...register("district",{
            required : "District Zorunlu Alan",
          })
        }
          label = "Enter District"
          size='small'
          fullWidth
          sx={{mb:2}}
          error={!!errors.district}
        />
      </Grid>
      <Grid size={{xs:12,md:6}}>
        <TextField
        {
          ...register("phone",{
            required : "Phone Zorunlu Alan",
          })
        }
          label = "Enter phone"
          size='small'
          fullWidth
          sx={{mb:2}}
          error={!!errors.phone}
        />
      </Grid>
      <Grid size={{xs:12,md:6}}>
        <TextField
        {
          ...register("adress",{
            required : "Adress Zorunlu Alan",
          })
        }
          label = "Enter adress"
          size='small'
          fullWidth
          multiline
          rows={3}
          sx={{mb:2}}
          error={!!errors.adress}
        />
      </Grid>
    </Grid>
  )
}

export default AdressForm
