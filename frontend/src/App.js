import { useEffect, useState } from 'react';
import './App.css';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import Pusher from 'pusher-js'
import messageService from './services/messages'
import { useDispatch, useSelector } from 'react-redux';
import { intitializeMessages, newMessage } from './reducers/messages';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"

function App() {
  const dispatch = useDispatch()
  const messages = useSelector(state => state)
  
  const initializeAllMessages = async () => {
    const allMessages = await messageService.getAll()
    dispatch(intitializeMessages(allMessages))
  }

  useEffect(() => {
    initializeAllMessages()
  }, [])

  useEffect(() => {
    const pusher = new Pusher('a71c2a5658b701ee38fc', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (message) => {
      dispatch(newMessage(message))
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }

  }, [messages])

  console.log(messages)

  return (
   
      <div className="app">
      <div className='app_body'>
      <Router>
        <Sidebar />
        
        <Routes>

        <Route path='/'>
        </Route>

        <Route path='/rooms/:roomId' element={<Chat />} />

        </Routes>
      
        

        </Router>
      </div>
      
    </div>
  
    
  );
}

export default App;
