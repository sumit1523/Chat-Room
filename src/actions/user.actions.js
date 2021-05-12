import { userConstants } from "./constants";
import { firestore } from 'firebase';

export const getRealtimeUsers = (uid) => {

	return async (dispatch) => {
		dispatch({ type: `${userConstants.GET_REALTIME_USERS}_REQUEST` });
		const db = firestore();
		const unsubscribe = db.collection("users")
			//.where("uid", "!=", uid)
			.onSnapshot((querySnapshot) => {
				const users = [];
				querySnapshot.forEach(function (doc) {
					if (doc.data()?.uid !== uid) {
						users.push(doc.data());
					}
				});
				dispatch({
					type: `${userConstants.GET_REALTIME_USERS}_SUCCESS`,
					payload: { users }
				});
			});

		return unsubscribe;
	}
}

export const updateMessage = (msgObj) => {
	return async dispatch => {

		const db = firestore();
		db.collection('conversations')
			.add({
				...msgObj,
				isView: false,
				createdAt: new Date()
			})
			.then((data) => {
				console.log('Message Sent');
				//success
				// dispatch({
				//     type: userConstants.GET_REALTIME_MESSAGES,
				// })
			})
			.catch(error => {
				console.log(error);
			});

	}
}

export const getRealtimeConversations = (user, scrollToBottom, onsendMsg) => {
	return async dispatch => {

		const db = firestore();
		db.collection('conversations')
			.where('user_uid_1', 'in', [user.uid_1, user.uid_2])
			.orderBy('createdAt', 'asc')
			.onSnapshot((querySnapshot) => {
				const conversations = [];
				let userconversation = [];
				querySnapshot.forEach(doc => {
					userconversation = (doc.data().user_uid_1 === user.uid_1 && doc.data().user_uid_2 === user.uid_2)
						||
						(doc.data().user_uid_1 === user.uid_2 && doc.data().user_uid_2 === user.uid_1);

					if (userconversation) {
						conversations.push(doc.data())
					}
				});

				dispatch({
					type: userConstants.GET_REALTIME_MESSAGES,
					payload: { conversations }
				})
				scrollToBottom();
				onsendMsg();
			})
		//user_uid_1 == 'myid' and user_uid_2 = 'yourId' OR user_uid_1 = 'yourId' and user_uid_2 = 'myId'
	}
}