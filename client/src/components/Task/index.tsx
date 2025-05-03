import React, { FC, useCallback, useContext } from "react";
import { Box, Card, CardActions, CardContent, Chip, Grid, IconButton, MenuItem, Select, SelectChangeEvent, Tooltip, Typography } from "@mui/material";
import { API_URL, TASK_STATUS } from "../../constants";
import { CalendarMonth, Delete } from "@mui/icons-material";
import { format } from "date-fns";
import { TaskProps } from "./types";
import { StatusTypes } from "../../types";
import axios from "axios";
import { AuthContext } from "../../services/AuthService";
import { errorHandler } from "../../utils";
import { AlertContext } from "../../services/AlertService";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { LoaderContext } from "../../services/LoaderService";

const Task: FC<TaskProps> = React.memo(({task, onUpdate, onDelete}) => {    
    const { token, logout } = useContext(AuthContext);
    const { dispatchAlert } = useContext(AlertContext);
    const { dispatchLoader } = useContext(LoaderContext);
    const navigate: NavigateFunction = useNavigate();

    const onChange = useCallback(async (e: SelectChangeEvent) => {
        dispatchLoader(true);
        try {
            const response = await axios.put(`${API_URL}/tasks/${task.id}`, {status: e.target.value}, {headers: {token}});
            onUpdate(task, e.target.value as unknown as StatusTypes);
            dispatchAlert({severity: 'success', message: response.data.message});
        } catch  (error: any) {
            errorHandler(error, navigate, logout, dispatchAlert);
        }
        dispatchLoader(false);
    }, [dispatchAlert, logout, navigate, token, dispatchLoader, onUpdate, task]);

    const onRemove = useCallback(async () => {
        dispatchLoader(true);
        try {
            const response = await axios.delete(`${API_URL}/tasks/${task.id}`, {headers: {token}});
            onDelete(task);
            dispatchAlert({severity: 'success', message: response.data.message});
        } catch(error: any) {
            errorHandler(error, navigate, logout, dispatchAlert);
        }
        dispatchLoader(false);
    }, [dispatchAlert, dispatchLoader, logout, navigate, token, onDelete, task]);

    return (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} display="flex" flexGrow="1">
            <Card style={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{task.title}</Typography>
                    <Typography variant="body2">{task.description}</Typography>
                </CardContent>
                <CardActions style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
                    <Typography sx={{ fontSize: 14 }} style={{ marginBottom: 10, marginLeft: 10, display: 'flex', alignItems: 'flex-end' }} color="text.secondary" gutterBottom><CalendarMonth />&nbsp;{format(new Date(task.due_date), 'MMM dd, yyyy')}</Typography>
                    <Box style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Select
                            value={task.status}
                            inputProps={{ 'aria-label': 'Filter' }}
                            sx={{'& .MuiSelect-select': {padding: 0}, '& .MuiChip-root': {marginTop: '0 !important'}}}
                            style={{borderRadius: 16}}
                            onChange={onChange}
                            >
                            {Object.entries(TASK_STATUS).map(([key, {color, label}]) => <MenuItem key={key} value={key}>
                                <Chip label={label}
                                    color="primary"
                                    style={{ backgroundColor: color }}/>
                            </MenuItem>)}
                        </Select>
                        <Tooltip title="Delete"><IconButton size="small" onClick={onRemove}><Delete /></IconButton></Tooltip>
                    </Box>
                </CardActions>
            </Card>
        </Grid>
    );
});

Task.displayName = 'Task';
export default Task;
