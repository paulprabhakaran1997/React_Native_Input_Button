/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  Alert,
  ToastAndroid,
  Modal,
  Image,
  ImageBackground
} from 'react-native';


import axios from 'axios';

const DismissKeyboard = ({ children }) =>(
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    { children }
  </TouchableWithoutFeedback>
)

const App = () =>{

  const baseUrl = "https://reactnative.dev/movies.json";
  const [userData , setUserData] = useState([]);
  const [showWarning , setShowWarning] = useState(false)

  const fetchData = async () =>{
    try{
      const response = await axios.get(baseUrl);
      console.log(response.data);
      setUserData(response.data)
    }
    catch(err){
      console.log(err.message)
    }
  }

  useEffect(() =>{
    // fetchData()
  },[])

  const [thisUser , setThisUser] = useState(
    { id : 0 , name : "" , age : "" }
  )

  const resetData = () =>{
    setThisUser({ id : 0, name : "" , age : "" });
    Keyboard.dismiss()
  }

  const addNew = () =>{
    resetData();
  }

  const inputHandler = (e , name) =>{
    setThisUser({
      ...thisUser,
      [name] : e
    })
  }

  const editUser = (obj) =>{
    console.log(obj);
    setThisUser(obj)
  }

  const deleteUser = (id) =>{
    const filteredUser = userData.filter((data) => data.id !== id);
    setUserData(filteredUser)
  }


  const [showImage , setShowImage] = useState("");

  const clearImage = () =>{
    setTimeout(() => { setShowImage("") },2500)
  }
  

  const validateUser = () =>{
    console.log(thisUser.name , thisUser.age);
    if(((thisUser.name).trim()).length !== 0){
      if(thisUser.id === 0){
        const id = userData.length ? userData[userData.length - 1].id + 1 : 1
        const newUserObj = { id : id , name : thisUser.name , age : thisUser.age }
        setUserData([...userData , newUserObj])
      }
      else {
        const newUserObj = userData.map((data) => data.id === thisUser.id ? thisUser : data);
        setUserData(newUserObj)
      }
      setShowImage("success");        
    }
    else {
      // window.alert("Please Enter Name");
      // Alert.alert('Warning' , "Please Enter Name" , [{text : 'Done !'}]);

      // ToastAndroid.show(
      //   'Please Enter Name',
      //   ToastAndroid.SHORT
      // )

      setShowWarning(true);
      setShowImage("error");

    }
    resetData();
    clearImage();
  }

  return (
    <DismissKeyboard>
      <View style={styles.body}>
        {/* <Text style={styles.text}>{userData.title}</Text> */}
        <Modal
          visible = {false}
          transparent
          onRequestClose = {() => setShowWarning(false)}
          animationType = 'slide'
        >
          <View style = {styles.centered_view}>
            <View style={styles.warning_modal}>
              <View style={styles.modal_header}>
                <Text style={{marginLeft : 5,fontSize : 20}}>Warning !</Text>
                <Button title='X' onPress = {() => setShowWarning(false)} />
              </View>
              <View style={styles.modal_body}>
                <Text style={{textAlign : 'center',fontSize : 25 , color : 'red'}}>Please Enter Name</Text>
                <Text style={styles.warning_button}  onPress = {() => setShowWarning(false)} >OK</Text>
              </View>
            </View>
            
          </View>
        </Modal>
        <Button title='+ New' onPress={() => addNew()} />
        <Text style={styles.text}>Name</Text>
        <TextInput
          // keyboardType='numeric'
          // secureTextEntry
          name='name'
          style={styles.input}
          value = { thisUser.name }
          onChangeText = {(e) => inputHandler(e , 'name')}
        />
        <Text style={styles.text}>Age</Text>
        <TextInput
          keyboardType='numeric'
          // secureTextEntry
          style={styles.input}
          value = { thisUser.age }
          onChangeText = {(e) => inputHandler(e , 'age')}
        />
        {/* <Button title='Click Me' onPress={() => console.log("Button Name = ", name)} /> */}
        <TouchableOpacity onPress={() => validateUser()} >
          <Text style={combineStyle1}>{thisUser.id === 0 ? 'Add' : 'Save Changes'}</Text>
        </TouchableOpacity>

        { showImage !== "" && (
          <Image 
            style={styles.image} 
            source = {showImage === 'success' ? require("./assets/success.png") : require("./assets/error.png")} 
            // resizeMode='stretch'
            // blurRadius = {5}
          />
        ) }

        {/* <TouchableHighlight onPress={() => {console.log("Touchable Name = ", name);setName('')}} >
          <Text style={combineStyle1}>Click Me</Text>
        </TouchableHighlight> */}
        {/* <Pressable 
          hitslop = {{ top : 10 , bottom : 10 , right : 10 , left : 10 }}
          onLongPress={() => {console.log("Pressable Name = ", name);setName('')}} 
          delayLongPress={2000}
        >
        <Text style={combineStyle1}>Click Me</Text>
        </Pressable> */}

        

        <View style={{ width: '100%', marginTop: 30 }}>
          <ImageBackground
            source={require("./assets/grey.jpg")}
          >
            {userData.length ? (
              userData.map((element, idx) => (
                <View style={styles.userlist} key={idx}>
                  <Text>{idx + 1}</Text>
                  <Text>{element.name}</Text>
                  <Text>{element.age}</Text>
                  <TouchableOpacity style={{ flexDirection: 'row' }}>
                    <Text onPress={() => editUser(element)} style={[styles.actionButton, { backgroundColor: 'darkcyan' }]}>Edit</Text>
                    <Text onPress={() => deleteUser(element.id)} style={[styles.actionButton, { backgroundColor: 'red' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: 'center' }}> No User </Text>
            )}
          </ImageBackground>
        </View>

      </View>
    </DismissKeyboard>
  )
}

const styles = StyleSheet.create({
  body : {
    flex : 1,
    alignItems : 'center'
  },
  text : {
    color : 'black',
    fontSize : 20,
    margin : 10
  },
  input : {
    borderWidth : 1,
    width : 200,
    borderColor : 'black',
    padding : 10,
    color:'black',
    borderRadius : 15,
    margin:10,
  },
  touchableButton : {
    textAlign : 'center',
    backgroundColor : 'green',
    color : 'white',
    borderColor : 'white',
  },
  userlist:{
    padding : 5,
    flexDirection : 'row',
    width : '100%',
    borderWidth : 1,
    borderColor : 'lightgrey',
    alignItems : 'center',
    justifyContent : 'space-between'
  },
  actionButton : {
    marginLeft : 3,
    padding : 3,
    textAlign : 'center',
    color : 'white',
    borderColor : 'white',
  },
  centered_view : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor : '#00000099'
  },
  warning_modal : {
    width : 300,
    height : 150,
    backgroundColor :'#ffffff',
    borderRadius : 10
  },
  modal_header : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    marginBottom : 6,
    borderBottomWidth : 1,
    borderBottomColor : 'black'
  },
  modal_body : {
    flex : 1,
    flexDirection : 'column',
    justifyContent : 'center'
  },
  warning_button : {
    textAlign : 'center',
    marginTop : 12,
    color : 'blue'
  },
  image : {
    width : 50,
    height : 50
  }
});

const combineStyle1 = StyleSheet.compose(styles.input , styles.touchableButton)

export default App;
