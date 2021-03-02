import moment from 'moment';
import 'moment/locale/pt-br';
import React from 'react';
import {
  StyleSheet,

  Text, TouchableOpacity,

  TouchableWithoutFeedback,
  View
} from 'react-native';
import Swipe from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyle from '../commonStyles';

export default (props) => {
  const date = props.doneAt ? props.doneAt : props.estimateAt;
  const formatedDate = moment(date).locale('pt-br').format('ddd D [de] MMMM');

  const doneStyle =
    props.doneAt != null ? {textDecorationLine: 'line-through'} : {};
  const getRightContent = ()=>{
    return (
      <TouchableOpacity onPress={() => props.onDelete && props.onDelete(props.id)} style={styles.right} activeOpacity={0.7}>
        <Icon name='trash' size={30} color="#FFF"/>
      </TouchableOpacity>
    )
  }

  const getLeftContent = ()=>{
    return (
      <View style={styles.left}>
        <Icon name='trash' size={20} color="#FFF" style={styles.excludeIcon}/>
        <Text style={styles.excludeText}>Excluir</Text>
      </View>
    )
  }
  
  
    return (
    <Swipe renderRightActions={getRightContent}
    renderLeftActions={getLeftContent}
    onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => props.toggleTasks(props.id)}>
          <View style={styles.checkContainer}>
            {getCheckView(props.doneAt)}
          </View>
        </TouchableWithoutFeedback>
        <View>
          <Text style={[styles.desc, doneStyle]}>{props.desc}</Text>
          <Text style={styles.subText}>{formatedDate}</Text>
        </View>
      </View>
    </Swipe>
  );
};

function getCheckView(done) {
  if (done) {
    return (
      <View style={styles.done}>
        <Icon name="check" size={20} color="#FFF"></Icon>
      </View>
    );
  } else {
    return <View style={styles.pending} />;
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: '#AAA',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor:'#FFF'
  },
  checkContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pending: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderRightColor: '#555',
  },
  done: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#4D7031',
    justifyContent: 'center',
    alignItems: 'center',
  },
  desc: {
    fontFamily: commonStyle.fontFamily,
    color: commonStyle.colors.mainTex,
    fontSize: 18,
  },
  subText: {
    fontFamily: commonStyle.fontFamily,
    color: commonStyle.colors.subText,
    fontSize: 12,
  },
  right :{
    backgroundColor: 'red',
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  left:{
    flex: 1,
    backgroundColor: 'red',
    flexDirection:'row',
    alignItems: 'center',
  },
  excludeText:{
    fontFamily: commonStyle.fontFamily,
    color:'#FFF',
    fontWeight:'700',
    fontSize: 20,
    margin: 10
  },
  excludeIcon:{
    marginLeft: 10
  }
});
