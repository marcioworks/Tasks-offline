import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/pt-br';
import React, { Component } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import commonStyles from '../commonStyles';

const initialState = { desc: '', date: new Date(), showDatePicker: false}

export default class AddTask extends Component {

  state={
    ...initialState
  }

save = () =>{
  const newTask ={
    desc: this.state.desc,
    date: this.state.date
  }

  this.props.onSave && this.props.onSave(newTask)
  this.setState({...initialState})
}

  getDatePicker =() =>{
    let datePicker = (<DateTimePicker mode='date'
    onChange={(_,date)=> {
      date = date ? date : new Date()
      this.setState({ date, showDatePicker: false})}}
    value={this.state.date} />)

    if(this.state.date === undefined){
      this.state.date = initialState.date
    }

    const dateString = moment(this.state.date).locale('pt-br').format('ddd, D [de] MMMM [de] YYYY')

    if(Platform.OS === 'android'){
      datePicker =(
      <View>
        <TouchableOpacity onPress={()=> this.setState({showDatePicker: true})}>
          <Text style={styles.date}>
            {dateString}
          </Text>
        </TouchableOpacity>
        {this.state.showDatePicker && datePicker}
      </View>)
    }
    return datePicker
  }
  render() {
    return (
      <Modal
        transparent={true}
        visible={this.props.isVisible}
        onRequestClose={this.props.onCancel}
        animationType="slide">
        <TouchableWithoutFeedback onPress={this.props.onCancel}>
          <View style={styles.background}></View>
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <Text style={styles.header}>Nova Tarefa</Text>
          <TextInput style={styles.input}
              placeholder='Nome da Tarefa' 
              onChangeText={ desc => this.setState({desc})}
              value={this.state.desc}
            />
          {this.getDatePicker()}
          <View style={styles.buttons}>
            <TouchableOpacity onPress={this.props.onCancel}>
              <Text style={styles.button}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.save}>
              <Text style={styles.button}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={this.props.onCancel}>
          <View style={styles.background}></View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    backgroundColor: '#FFF',
  },
  header: {
    fontFamily: commonStyles.fontFamily,
    backgroundColor: commonStyles.colors.today,
    color: commonStyles.colors.secondary,
    textAlign: 'center',
    padding: 15,
    fontSize: 18,
  },
  input:{
    fontFamily: commonStyles.fontFamily,
    color: '#333',
    height: 40,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 6
  },
  buttons:{
    flexDirection:'row',
    justifyContent: 'flex-end'
  },
  button:{
    margin: 20,
    marginRight: 30,
    color: commonStyles.colors.today
  },
  date:{
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    marginLeft: 15,
    marginTop: 10
  }
});
