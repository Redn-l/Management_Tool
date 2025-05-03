import React, { useState, useEffect, useCallback, FC, useContext } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { errorHandler } from '../../utils';
import { API_URL } from '../../constants';
import { EmptyProps, SortTypes, StatusTypes, TaskType } from '../../types';
import { AuthContext } from '../../services/AuthService';
import { IconButton, LinearProgress, Theme, Tooltip, useMediaQuery, useTheme, Button, Grid, Typography } from '@mui/material';
import './styles.css';
import { AlertContext } from '../../services/AlertService';
import SearchBar from '../SearchBar';
import FilterDropdown from '../FilterDropdown';
import SortDropdown from '../SortDropdown';
import Task from '../Task';
import AddTaskDialog from '../AddTaskDialog';
import { AddTask } from '@mui/icons-material';
import { LoaderContext } from '../../services/LoaderService';

const Tasks: FC<EmptyProps> = React.memo(() => {
  const [tasks, setTasks] = useState<TaskType[]>([] as TaskType[]);
  const [filteredTasks, setFilteredTasks] = useState<TaskType[]>([] as TaskType[]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filter, setFilter] = useState<StatusTypes>(StatusTypes.all);
  const [sort, setSort] = useState<SortTypes>(SortTypes.none);
  const [showAddTask, setShowAddTask] = useState<boolean>(false);

  const handleClickOpen = useCallback(() => {
    setShowAddTask(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowAddTask(false);
  }, []);

  const { token, logout } = useContext(AuthContext);
  const { dispatchAlert } = useContext(AlertContext);
  const {loading, dispatchLoader} = useContext(LoaderContext);

  const theme: Theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'), {defaultMatches: true});

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    const result = tasks.filter(task => {
      const lowerSearchValue = searchValue.toLowerCase();
      const lowerTitle = task.title.toLowerCase();
      const statusFilter = filter === StatusTypes.all ? true : task.status === filter;
      return lowerTitle.indexOf(lowerSearchValue) !== -1 && statusFilter;
    });
    switch(sort) {
      case SortTypes.title:
        result.sort((a: TaskType, b: TaskType) => {
          if (a.title > b.title) return 1;
          if (a.title === b.title) return 0;
          return -1;
        });
        break;
      case SortTypes.dueDate:
        result.sort((a: TaskType, b: TaskType) => {
          if (a.due_date > b.due_date) return 1;
          if (a.due_date === b.due_date) return 0;
          return -1;
        });
        break;
    }
    setFilteredTasks(result);
  }, [searchValue, filter, sort, tasks]);

  const getTasks = useCallback((): void => {
    dispatchLoader(true);
    axios.get(`${API_URL}/tasks`, {
        headers: {
            token
        }
    })
      .then((response: AxiosResponse<TaskType[], any>) => {
        setTasks(response.data);
        dispatchLoader(false);
    })
      .catch((error: AxiosError) => {
        errorHandler(error, navigate, logout, dispatchAlert);
        dispatchLoader(false);
    });
  }, [token, navigate, logout, dispatchAlert, dispatchLoader]);

  useEffect((): void => {
    if (!token) navigate('/');
  }, [token, navigate]);

  useEffect((): void => {
 
    getTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTask = useCallback((newTask: TaskType): void => {
    setTasks([...tasks, newTask]);
  }, [tasks]);

  const onUpdate = useCallback((task: TaskType, status: StatusTypes) => {
    setTasks(tasks.map(t => {
      if (t.id === task.id) return {...t, status};
      return t;
    }));
  }, [tasks]);

  const onDelete = useCallback((task: TaskType) => {
    setTasks(tasks.filter(t => t.id !== task.id));
  }, [tasks]);

  return (
    <>
      <div style={{marginTop: 64}}>{loading ? <LinearProgress /> : <div className='loader-placeholder' />}</div>
      <div className='task-container'>
        {!isSmallScreen ? <div style={{display: 'flex', columnGap: 10}}>
            <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
            <FilterDropdown filter={filter} setFilter={setFilter} />
            <SortDropdown sort={sort} setSort={setSort} />
            <Tooltip title='Добавить задачу'><IconButton aria-label='Добавить задачу' onClick={handleClickOpen}><AddTask /> </IconButton></Tooltip>
        </div> : <div><SearchBar searchValue={searchValue} setSearchValue={setSearchValue} /><div style={{display: 'flex', justifyContent: 'space-between', marginTop: 15, columnGap: 5}}>
            <FilterDropdown filter={filter} setFilter={setFilter} />
            <SortDropdown sort={sort} setSort={setSort} />
            <Button variant='outlined' aria-label='Добавить задачу' style={{fontSize: 8, minWidth: 100, height: 40}}><AddTask />&nbsp;Добавить задачу</Button>
        </div>
        </div>}
        {filteredTasks.length ? <Grid container className='grid' spacing={2} style={{marginTop: 0}}>
          {filteredTasks.map((task: TaskType) => <Task key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />)}
        </Grid> : <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300}}>
          <Typography color="text.secondary">No tasks to show</Typography>
          </div>}
        <AddTaskDialog onAdd={addTask} open={showAddTask} handleClose={handleClose} />
      </div>
    </>
  );
});
Tasks.displayName = 'Tasks';

export default Tasks;
