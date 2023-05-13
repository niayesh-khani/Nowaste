import React, { useEffect, useState } from "react";
import './OrderPage.css';
import Header from "../components/Header";
import { ThemeProvider } from "@mui/styles";
import { Button, Box, Grid, Typography, createTheme } from "@material-ui/core";
import Footer from "../components/Footer";
import { KeyboardArrowRightIcon } from '@mui/icons-material';
import PlaceIcon from '@mui/icons-material/Place';
import WalletIcon from '@mui/icons-material/Wallet';
import CircleChecked from '@mui/icons-material/CheckCircleOutline';
import { CheckBox, CircleCheckedFilled, CircleUnchecked } from "@material-ui/icons";

const theme = createTheme({
    palette: {
        primary: {
            main: '#dd9d46',
        },
        secondary: {
            main: '#a44704',
        }
    },
})

export default function OrderPage(){
    
    return(
        <ThemeProvider theme={theme}>
            <Header />
            <Grid container spacing={2} sx={{paddingBottom: "1%"}} className="orderpage-root">
                <Grid item lg={4} md={4} sm={12}>
                    <Box className="orderpage-box" style={{justifyContent: 'space-between'}}>
                        <Typography variant="h5"
                            gutterBottom
                            className="orderpage-title"
                        >
                            Shopping card
                            <span style={{color:"#E74C3C"}}>(2)</span>
                        </Typography>
                        <div className="orderpage-details-div">
                            <Grid container spacing={2} className="orderpage-grid">
                                <Grid item>
                                    <Typography>Ghormeh sabzi</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography> <span style={{color: '#8a8686'}}>2×</span>18$ </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} className="orderpage-grid">
                                <Grid item>
                                    <Typography>Fesenjoon</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography> <span style={{color: '#8a8686'}}>1×</span>18$ </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} className="orderpage-grid">
                                <Grid item>
                                    <Typography>Zereshk polo</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography> <span style={{color: '#8a8686'}}>1×</span>18$ </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} className="orderpage-grid">
                                <Grid item>
                                    <Typography>Gheymeh</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography> <span style={{color: '#8a8686'}}>5×</span>18$ </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} className="orderpage-grid">
                                <Grid item>
                                    <Typography>Polo</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography> <span style={{color: '#8a8686'}}>2×</span>18$</Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} className="orderpage-grid">
                                <Grid item>
                                    <Typography>Polo</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography> <span style={{color: '#8a8686'}}>2×</span>18$</Typography>
                                </Grid>
                            </Grid>
                        </div>
                        <hr className="hr-tag" />
                        <Grid container spacing={2} className="orderpage-grid">
                            <Grid item>
                                <Typography>Subtotal</Typography>
                            </Grid>
                            <Grid item>
                                <Typography> 205$ </Typography>
                            </Grid>
                        </Grid>
                        <hr className="hr-tag" />
                        <Grid container spacing={2} className="orderpage-grid">
                            <Grid item>
                                <Typography>Discount</Typography>
                            </Grid>
                            <Grid item >
                                <Typography> 15$ </Typography>
                            </Grid>
                        </Grid>
                        <hr className="hr-tag" />
                        <Grid container spacing={2} className="orderpage-grid">
                            <Grid item>
                                <Typography>Grand total</Typography>
                            </Grid>
                            <Grid item>
                                <Typography> 190$ </Typography>
                            </Grid>
                        </Grid> 
                        <Button className="order-submit">
                            Pay
                        </Button>
                    </Box>
                </Grid>
                <Grid item lg={8} md={8} sm={12}>
                    <Box className="orderpage-box">
                        <Typography variant="h5"
                            gutterBottom
                            className="orderpage-title"
                        >
                            Shopping info
                        </Typography>
                        <Typography
                            style={{alignSelf: 'flex-start', fontSize: '20px'}}
                        >
                            Address
                        </Typography>
                        <Box className="orderpage-shopinfo-box">
                            <Typography style={{alignSelf: 'flex-start', justifyContent: 'center'}}>
                                <PlaceIcon style={{marginTop: '10px'}} />
                                Iran, Tehran, IUST
                            </Typography>
                        </Box>
                        <Typography
                            style={{alignSelf: 'flex-start', fontSize: '20px', marginTop: "30px"}}
                        >
                            Payment method
                        </Typography>
                        <Box className="orderpage-shopinfo-box">
                            <Typography style={{alignSelf: 'flex-start', justifyContent: 'center'}}>
                                <WalletIcon style={{marginTop: '1px'}} color="secondary"/>
                                Wallet
                                
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Footer />
        </ThemeProvider>
    )
}