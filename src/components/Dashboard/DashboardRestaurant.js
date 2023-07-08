import React, { useEffect, useState } from "react";
import {Box, createTheme, Divider, FormControl, Grid, Icon, IconButton, Tooltip, InputAdornment, MenuItem, TextField, ThemeProvider, Typography, withStyles } from "@material-ui/core";
import '../../pages/EditProfile.css';
import HeaderRestaurant from '../HeaderRestaurant';
import '../../pages/EditRestaurant.css';
import 'react-phone-input-2/lib/style.css';
import axios from "axios";
import { useHistory } from "react-router-dom";
import Footer from "../Footer";
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from "@mui/material";
import './DashboardRestaurant.css';
import PropTypes from 'prop-types';
import { visuallyHidden } from '@mui/utils';
import { useMemo } from "react";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#dd9d46',
        },
        secondary: {
            main: '#a44704',
        }
    },
});
const headCells = [
    {
        id: 'no',
        numeric: true,
        disablePadding: true,
        label: 'No.'
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Restaurant name'
    },
    {
        id: 'customer_name',
        numeric: false,
        disablePadding: false,
        label: 'Customer name'
    },
    {
        id: 'customer_email',
        numeric: false,
        disablePadding: false,
        label: 'Customer Email'
    },
    {
        id: 'order',
        numeric: false,
        disablePadding: false,
        label: 'Order'
    },
    {
        id: 'price',
        numeric: false,
        disablePadding: false,
        label: 'Price'
    },
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        label: 'Date'
    },
    {
        id: "status",
        numeric: false,
        disablePadding: false,
        label: 'Status'
    },
];
function createData(name, customer_name, customer_email, order, price, date, status, restaurant_id, order_id) {
    return {
        name,
        customer_name,
        customer_email,
        order,
        price,
        date,
        status,
        restaurant_id,
        order_id
    };
}  

function descendingComparator(a, b, orderBy){
    if (b[orderBy] < a[orderBy]){
        return -1;
    }
    if (b[orderBy] > a[orderBy]){
        return 1;
    }
    return 0;
};

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if(order !== 0){
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
};

function DashboardTableHead(props) {
    const { order, orderBy, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel 
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null }
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};
DashboardTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

export default function DashboardRestaurant(){
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('Price');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] =  useState(0);
    const history = useHistory();
    const [color, setColor] = useState(localStorage.getItem('avatarColor') || getRandomColor());
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const [orderHistory, setOrderHistory] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;
    function getRandomColor() {
        const colors = ['#FFA600', '#fff2bf', '#ffe480', '#a2332a' , '#E74C3C' , '#690000' , '#595959', '#3e3e3e' , '#C6C6C6', '#ABABAB', '#B9B9B9'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    // console.log("$$$$$$$$$$$$$$$$$",favoriteRestaurant);
    const [rows, setRows] = useState([]);
    const rowsWithIndex = rows.map((row, index) => ({ ...row, index }));
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const ordersToShow = rowsWithIndex.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(rowsWithIndex.length / ordersPerPage);

    //sorting
    const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
    const handleSort = (field) => {
        const newSortConfig = { field, direction: 'asc' };
        // If the same column is clicked again, toggle the sort direction
        if (sortConfig.field === field && sortConfig.direction === 'asc') {
            newSortConfig.direction = 'desc';
        }
        setSortConfig(newSortConfig);
    };
    // Sort the data based on the sortConfig state
    const sortedData = useMemo(() => {
        if (sortConfig.field) {
            const compareFunction = (a, b) => {
                if (a[sortConfig.field] < b[sortConfig.field]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.field] > b[sortConfig.field]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            };
            return ordersToShow.sort(compareFunction);
            }
            return ordersToShow;
        }, [sortConfig, ordersToShow]);

    useEffect(() => {
        axios.get(
            `http://5.34.195.16/restaurant/${id}/orderview/`,
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            console.log(response.data);
            setOrderHistory(response.data);
            console.log("length" + response.data);
        })
        .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        console.log("order history is populated");
        if (orderHistory) {
        const newRows = orderHistory.map((order) => {
            if (order.orderDetails.restaurantDetails && order.userDetails) {
            const restaurant_name = order.orderDetails.restaurantDetails.name;
            const customer_name = order.userDetails.name;
            const customer_email = order.userDetails.email;
            let orderText = "";
            if (order.orderDetails.orderItems && order.orderDetails.orderItems.length >= 0) {
            orderText = order.orderDetails.orderItems
                .map((item) => `${item.quantity}×${item.name_and_price.name}`)
                .join(', ');
                
            } else {
                orderText = "No item";
            }
            console.log("order row is: " );
            const price = order.orderDetails.Subtotal_Grandtotal_discount[1];
            const date = new Date(order.created_at).toISOString().split('T')[0];
            const status = order.status;
            const restaurant_id = order.orderDetails.restaurantDetails.id;
            const order_id = order.orderDetails.id;
            return createData(
                restaurant_name,
                customer_name,
                customer_email,
                orderText,
                price,
                date,
                status,
                restaurant_id,
                order_id
            );
            }
            return null; // Skip invalid orders
        });

          setRows(newRows.filter(Boolean)); // Filter out null rows
        }
    }, [orderHistory]);

    const handleRequestSort = (e, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = useMemo(
        () => 
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage , page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage]
    );
    
    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const getRowColor = (status) => {
        if(status === "Completed") {
            return "rgba(65, 156, 86, 0.5)";
        } else if(status === "InProgress") {
            return "rgba(242, 223, 51, 0.4)";
        } else if(status === "notOrdered") {
            return "rgba(245, 132, 12, 0.4)"
        } else if(status === "Cancled"){
            return "rgba(176, 173, 169, 0.5)";
        } 
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const handleStatus = (status) => {
        if(status === "InProgress")
            return "In progress";
        else if(status === "notOrdered")
            return "Not ordered";
        return status;
    }

    const showCancelIcon = (status) => {
        return status === 'notOrdered';
    }

    const showAcceptIcon = (status) => {
        return status === 'notOrdered';
    }

    const handleCancleOrdering = (Oid, Rid) => {
        const userData = {
            status:"Cancled"
        }
        axios.put(`http://5.34.195.16/restaurant/restaurant_view/${Rid}/${id}/order/${Oid}/`, userData,
        {headers :{
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "GET,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)
        }})
        .then((response) => {
            console.log(response);
            window.location.reload(false);
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response);
            } 
        }); 
    }

    const handleAcceptOrdering = (Oid, Rid) => {
        const userData = {
            status:"InProgress"
        }
        axios.put(`http://5.34.195.16/restaurant/restaurant_view/${Rid}/${id}/order/${Oid}/`, userData,
        {headers :{
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "GET,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)
        }})
        .then((response) => {
            console.log(response);
            window.location.reload(false);
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response);
            } 
        }); 
    }


    return (
        <ThemeProvider theme={theme}>
            <div className="dashboard-back">
                <HeaderRestaurant />
                <Grid container spacing={2} className="dashboard-grid">
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box className="dashboard-box" id="order-history-box">
                            <Typography
                                variant="h5" 
                                color="textPrimary"
                                gutterBottom
                                className="dashboard-title-manager"
                            >
                                Order history
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell onClick={() => handleSort('name')}>
                                            Restaurant name
                                            {sortConfig.field === 'name' && (
                                                <>
                                                {sortConfig.direction === 'asc' ? (
                                                    <KeyboardArrowUp style={{ fontSize: '16px', verticalAlign: 'middle' }} />
                                                ) : (
                                                    <KeyboardArrowDown style={{ fontSize: '16px', verticalAlign: 'middle' }} />
                                                )}
                                                </>
                                            )}
                                        </TableCell>
                                        <TableCell onClick={() => handleSort('customer-name')}>
                                            Customer name
                                            {sortConfig.field === 'customer-name' && (
                                                <>
                                                {sortConfig.direction === 'asc' ? (
                                                    <KeyboardArrowUp style={{ fontSize: '16px', verticalAlign: 'middle' }} />
                                                ) : (
                                                    <KeyboardArrowDown style={{ fontSize: '16px', verticalAlign: 'middle' }} />
                                                )}
                                                </>
                                            )}
                                        </TableCell>
                                        <TableCell>Customer email</TableCell>
                                        <TableCell align="left">Order</TableCell>
                                        <TableCell align="left" onClick={() => handleSort('price')}>
                                            Price
                                            {sortConfig.field === 'price' && (
                                            <>
                                            {sortConfig.direction === 'asc' ? (
                                                <KeyboardArrowUp style={{ fontSize: '16px', verticalAlign: 'middle' }} />
                                            ) : (
                                                <KeyboardArrowDown style={{ fontSize: '16px', verticalAlign: 'middle' }} />
                                            )}
                                            </>
                                        )}
                                        </TableCell>
                                        <TableCell align="left">Date</TableCell>
                                        <TableCell align="left" onClick={() => handleSort('status')}>
                                            Status
                                            {sortConfig.field === 'status' && (
                                            <>
                                            {sortConfig.direction === 'asc' ? (
                                                <KeyboardArrowUp style={{ fontSize: '16px', verticalAlign: 'middle' }} />
                                            ) : (
                                                <KeyboardArrowDown style={{ fontSize: '16px', verticalAlign: 'middle' }} />
                                            )}
                                            </>
                                        )}
                                        </TableCell>
                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {sortedData.map((row) => (
                                        <TableRow key={row.order_id}
                                            // sx={{ cursor: row.status === 'Completed' ? 'pointer' : 'default',}}
                                            tabIndex={-1}
                                            style={{backgroundColor: getRowColor(row.status)}}
                                            // onClick={() => handleRowClick(row)}
                                        >
                                            <TableCell component="th" scope="row">
                                            {row.name}
                                            </TableCell>
                                            <TableCell align="left">{row.customer_name}</TableCell>
                                            <TableCell align="left">{row.customer_email}</TableCell>
                                            <TableCell align="left">{row.order}</TableCell>
                                            <TableCell align="left">{row.price}</TableCell>
                                            <TableCell align="left">{row.date}</TableCell>
                                            <TableCell align="left">
                                                {handleStatus(row.status)}
                                                {showAcceptIcon(row.status) && 
                                                    <Tooltip title="Accept">
                                                    <IconButton onClick={() => handleAcceptOrdering(row.order_id, row.restaurant_id)} title="Cancel order">
                                                        <CheckIcon style={{color:'green'}}/>
                                                    </IconButton>
                                                    </Tooltip>
                                                }
                                                {showCancelIcon(row.status) && 
                                                    <Tooltip title="Reject">
                                                    <IconButton onClick={() => handleCancleOrdering(row.order_id, row.restaurant_id)} title="Cancel order">
                                                        <ClearIcon style={{color:'red'}}/>
                                                    </IconButton>
                                                    </Tooltip>
                                                }
                                            </TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {/* Pagination controls */}
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                    <Pagination count={totalPages} page={currentPage} onChange={(event, page) => setCurrentPage(page)} shape="rounded"/>
                                </div>
                            </TableContainer>
                        </Box>
                    </Grid>
                </Grid>
                <Footer />
            </div>
        </ThemeProvider>
    )
}