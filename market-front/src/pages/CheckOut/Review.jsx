import { Box, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'

const Review = () => {
    const { getValues } = useFormContext()
  return (
    <Stack spacing={2} sx={{mb:3}} divider={<Divider/>}>
        <Box>
            <Typography
                variant='subtitle2'
                gutterBottom
            >
                Teslimat Bilgileri
            </Typography>
            <Typography
                gutterBottom
            >
                Şehir / İlçe : {getValues("city")} {getValues("district")}
            </Typography>
            <Typography
                gutterBottom
            >
                Numara : {getValues("phone")}
            </Typography>
            <Typography
                gutterBottom
            >
                Adress / Şehir : {getValues("adress")} {getValues("city")}
            </Typography>
        </Box>
            <Typography
                variant='subtitle2'
                gutterBottom
            >
                Ödeme Bilgileri
            </Typography>
            <Typography
                gutterBottom
            >
                Kart İsmi : {getValues("cartname")}
            </Typography>
            <Typography
                gutterBottom
            >
                Kart Numarası : {getValues("cartnumber")}
            </Typography>
            <Typography
                gutterBottom
            >
                Son Geçerlilik Tarihi : {getValues("expirydate")}
            </Typography>
    </Stack>
  )
}

export default Review
