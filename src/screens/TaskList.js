import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import 'moment/locale/pt-br';
import React, { Component } from 'react';
import { Alert, FlatList, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import todayImage from '../../assets/imgs/today.jpg';
import commonStyles from '../commonStyles';
import Task from '../components/Task';
import AddTask from './AddTask';



const initialState ={
  visibleTasks: [],
  showDone: true,
  showAddTask: false,
  tasks: []
}

export default class TaskList extends Component {
  state = {
    ...initialState
  };

  componentDidMount = async ()=>{
    const stateString = await AsyncStorage.getItem('taskState')
    const state = JSON.parse(stateString) || initialState
    this.setState(state,this.filterTasks)
  }

  addTask = newTask =>{
    if(!newTask.desc || !newTask.desc.trim()){
      Alert.alert('Dados inválidos','Descrição não informada!')
      return
    }

    const tasks =[...this.state.tasks]
    tasks.push({
      id: Math.random(),
      desc: newTask.desc,
      estimateAt:newTask.date,
      doneAt: null
    })

    this.setState({tasks,showAddTask:false}, this.filterTasks)

  }

  deleteTasks = id =>{
    const tasks = this.state.tasks.filter(task => task.id !== id)
    this.setState({tasks},this.filterTasks)

  }

  filterTasks = () => {
    let visibleTasks = null
    if(this.state.showDone){
      visibleTasks = [...this.state.tasks]
    }
    else{
      const pendding = task => task.doneAt === null
      visibleTasks = this.state.tasks.filter(pendding)
    }

    this.setState({ visibleTasks})
    AsyncStorage.setItem('taskState',JSON.stringify(this.state))
  }

  toggleFilter = () =>{
    this.setState({showDone: !this.state.showDone},this.filterTasks)
  }

  toggleTask = taskId =>{
    const tasks = [...this.state.tasks]
    tasks.forEach(task => {
      if(task.id === taskId){
        task.doneAt = task.doneAt ? null : new Date()
      }
    })
    this.setState({tasks},this.filterTasks)
    
  }
  render() {
    const today = moment().locale('pt-br').format('ddd, D [de] MMMM');
    return (
      <View style={styles.container}>
        <AddTask isVisible={this.state.showAddTask}
          onCancel={()=> this.setState({showAddTask: false})}
          onSave={this.addTask}/>
        <ImageBackground style={styles.background} source={todayImage}>
          <View style={styles.iconBar}>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Icon name={this.state.showDone? 'eye' : 'eye-slash'} size={30} color={commonStyles.colors.secondary}/>
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>Hoje</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
          <FlatList data={this.state.visibleTasks}
            keyExtractor={item => `${item.id}`}
            renderItem={({item})=> <Task {...item} onDelete={this.deleteTasks}  toggleTasks={this.toggleTask} /> }/>
        </View>
        <View >
          <TouchableOpacity style={styles.addButton} 
          activeOpacity={0.7} onPress={() => this.setState({showAddTask:true})}>
            <Icon name='plus' size={25} style={{color: commonStyles.colors.secondary,}}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  taskList: {
    flex: 7,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 50,
    color: commonStyles.colors.secondary,
    marginLeft: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 30,
    marginLeft: 20,
    marginBottom: 20,
  },
  iconBar:{
    flexDirection:'row',
    marginHorizontal:20,
    justifyContent:'flex-end',
    marginTop: Platform.OS === 'ios' ? 40: 10
  },
  addButton:{
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#3e3e3e',
    borderRadius: 25,
    backgroundColor: commonStyles.colors.today,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
