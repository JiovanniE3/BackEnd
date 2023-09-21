const socket = io()

const user = prompt("Enter Email")

document.getElementById("user").innerHTML = "User: " + user;


document.getElementById('addMessage').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const productData = {

        user: user,
        message: formData.get('message')
    };


    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if (response.ok) {

        } else {

        }
    } catch (error) {
        console.error('Error sending POST request:', error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.getElementById('deleteButton');

    deleteButton.addEventListener('click', () => {
        const url = '/api/messages/'; 

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', 
            },
        })
            .then(response => {
                if (response.ok) {

                } else {
                    console.error('DELETE request failed');
                }
            })
            .catch(error => {
                console.error('DELETE request failed', error);
            });
    });
});


socket.on('cleanMessage', ({}) => {

    ul="Deleted chat, start a new chat...";

    let ulProduct = document.getElementById('mainChat')
    ulProduct.innerHTML = ul

});


socket.on('newMessage', (newMessage, messages) => {
    console.log(`New message: ${newMessage.message}`)

    let ul = ''
    messages.forEach(message => {
        ul += `<li>${message.user} : ${message.message}</li>`
    })

    let ulProduct = document.getElementById('mainChat')
    ulProduct.innerHTML = ul

})



const loadProducts = () => {
    fetch('/api/messages')
        .then(data => {
            return data.json();
        })
        .then(messages => {
            let ul = ''
            messages.forEach(message => {
                ul += `<li>${message.user} : ${message.message}</li>`
            })

            let ulProduct = document.getElementById('mainChat')
            ulProduct.innerHTML = ul
        });
}

loadProducts()