import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { getRealtimeUsers, updateMessage, getRealtimeConversations } from '../../actions';

const User = (props) => {
	const { user, onClick, selectedUserUid } = props;

	return (
		<div onClick={() => selectedUserUid !== user.uid && onClick(user)} className={`displayName ${selectedUserUid === user.uid ? 'active' : ''}`}>
			<div className="displayPic">
				<img src="https://i.pinimg.com/originals/be/ac/96/beac96b8e13d2198fd4bb1d5ef56cdcf.jpg" alt="" />
			</div>
			<div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', margin: '0 10px' }}>
				<span style={{ fontWeight: 500 }}>{user.firstName} {user.lastName}</span>
				<span className={user.isOnline ? `onlineStatus` : `onlineStatus off`}></span>
			</div>
		</div>
	);
};

const HomePage = () => {

	const dispatch = useDispatch();
	const auth = useSelector(state => state.auth);
	const user = useSelector(state => state.user);

	const [chatStarted, setChatStarted] = useState(false);
	const [chatUser, setChatUser] = useState('');
	const [senderFirstName, setSenderFistName] = useState('');
	const [message, setMessage] = useState('');
	const [userUid, setUserUid] = useState(null);
	const [headerBg, setHeaderBg] = useState('');

	let getAllUser;

	const keepFocus = useRef(null);
	const audioRef = useRef();
	const endOfMessage = useRef(null);

	useEffect(() => {
		console.log(`getRealtimeUsers`)
		// eslint-disable-next-line
		getAllUser = dispatch(getRealtimeUsers(auth.uid))
			.then(allUser => {
				return allUser;
			})
			.catch(error => {
				console.log(error);
			})
		setHeaderBg(setBg());
		return () => {
			//cleanup
			console.log('cleanUp...')
			getAllUser.then(f => f()).catch(error => console.log(error));
		}
	}, [getAllUser]);

	//componentWillUnmount
	// useEffect(() => {
	// 	return () => {
	// 		//cleanup
	// 		console.log('cleanUP')
	// 		getAllUser.then(f => f()).catch(error => console.log(error));
	// 	}
	// }, [getAllUser]);

	const scrollToBottom = () => {
		endOfMessage.current.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	}

	const initChat = (user) => {
		console.log('chat Initiated...')
		setChatStarted(true);
		setChatUser(`${user.firstName} ${user.lastName} `);
		setSenderFistName(`${user.firstName} `);
		setUserUid(user.uid);
		if (!user?.conversations) dispatch(getRealtimeConversations({ uid_1: auth.uid, uid_2: user.uid }, scrollToBottom, onsendMsg));
	}

	const onsendMsg = () => {
		// audioRef.current.play();
	};

	const onChangeMsg = (e) => {
		setMessage(e.target.value);
	};

	const submitMessage = (e) => {
		e.preventDefault();
		const msgObj = {
			user_uid_1: auth.uid,
			user_uid_2: userUid,
			message
		}
		if (message !== "") {
			dispatch(updateMessage(msgObj))
				.then(() => {
					onsendMsg();
					setMessage('');
				})
				.catch(e => {
					console.log(e, 'Message not sent');
				});
		}

		keepFocus.current.focus();
		scrollToBottom();
	}
	const setBg = () => {
		return Math.floor(Math.random() * 16777215).toString(16);
	}
	console.log(user, 'users');
	return (
		<Layout>
			<section className="container">
				<div className="listOfUsers">
					{user && user?.users?.length > 0 ?
						user?.users.map(user => {
							return (
								<User
									onClick={initChat}
									key={user.uid}
									user={user}
									selectedUserUid={userUid}
								/>
							);
						}) : null
					}
				</div>
				<div className="chatArea">
					<div className="messageSections">
						<div className="chatHeader" style={{ background: `radial-gradient(#${headerBg}, #000000b0)` }}>
							{chatStarted ? chatUser : 'Welcome to Chat Room'}
						</div>
						<div style={{ paddingTop: '40px' }}>
							{chatStarted ?
								user.conversations.map(con =>
									<div style={{ textAlign: con.user_uid_1 === auth.uid ? 'right' : 'left', margin: '5px' }}>
										<div className={con.user_uid_1 === auth.uid ? "messageStyle-right" : "messageStyle-left"} >
											<div className="sender_pic">
												{con.user_uid_1 === auth.uid ? auth?.firstName : senderFirstName}
											</div>
											<p>{con.message}</p>
										</div>
									</div>)
								: null
							}
						</div>
						<div ref={endOfMessage}></div>
					</div>
					{
						chatStarted ?
							<form className="chatControls">
								<input
									value={message}
									onChange={(e) => onChangeMsg(e)}
									placeholder=" message..."
									style={{ width: '78%' }}
									ref={keepFocus}
								/>
								<audio ref={audioRef} src={require("../../assets/sound1.mp3")} />
								<button type='submit' style={{ width: '20%', backgroundColor: 'forestgreen' }} onClick={(e) => submitMessage(e)}>Send</button>
							</form>
							: null
					}
				</div>
			</section>
		</Layout>
	);
}

export default HomePage;