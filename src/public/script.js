window.onload = () => {
    const socketio = io()

    const nickname = prompt('Digite seu nickname:')

    socketio.emit('enter', nickname)
    socketio.emit('before-messages')
    socketio.on('get-before-messages', messages => {
        messages.map(message => {
            boxMessages.innerHTML += `<div class="box-message ${message.fromNickname === nickname ? 'from-me' : ''}">
                <div class='message ${message.fromNickname === nickname ? 'message-from-me' : ''}'>
                    <span><b>${message.fromNickname === nickname ? 'Eu' : message.fromNickname}</b></span>
                    <br />
                    <span>${message.message}</span>
                </div>
            </div>`;
        })
    })
    socketio.on('get-message', message => {
        boxMessages.innerHTML += `<div class="box-message ${message.fromNickname === nickname ? 'from-me' : ''}">
            <div class='message ${message.fromNickname === nickname ? 'message-from-me' : ''}'>
                <span><b>${message.fromNickname === nickname ? 'Eu' : message.fromNickname}</b></span>
                <br />
                <br />
                <span>${message.message}</span>
            </div>
        </div>`;
    })

    const formInputs = document.getElementById("box-inputs");
    const inputText = document.querySelector("#box-inputs input");
    const boxMessages = document.getElementById('box-messages')

    formInputs.addEventListener('submit', e => {
        e.preventDefault();
        if(inputText.value !== "") {
            socketio.emit('send-message', inputText.value)
            inputText.value = "";  
        } 
    })
}