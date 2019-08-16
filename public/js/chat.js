const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const urlTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

function autoscroll ()
{
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight =  $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight
    console.log(containerHeight)
    console.log(newMessageHeight)
    console.log(scrollOffset)
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = messages.scrollHeight;
    }

    
}

socket.on('message', (message) => 
{
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm')
    });
    $messages.insertAdjacentHTML('beforeend', html);

    autoscroll();
})

socket.on('locationMessage', (message) => 
{
    const html = Mustache.render($urlTemplate, {
        username: message.username,
        url: message.text,
        createdAt: moment(message.createdAt).format('HH:mm')
    })
    $messages.insertAdjacentHTML('beforeend', html)

    autoscroll()
})

socket.on('roomData', (usersData) => {
    const html = Mustache.render(sidebarTemplate, {
        room: usersData.room,
        users: usersData.users,
    })
    $sidebar.innerHTML = html
})

$messageForm.addEventListener('submit', (e) => 
{
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message, (error) => 
    {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = '';
        $messageFormInput.focus()

        if (error)
            return console.log(error);
        
        console.log('Message delivered');
    });
})

$sendLocationButton.addEventListener('click', () => 
{
    $sendLocationButton.setAttribute('disabled', 'disabled')

    if (!navigator.geolocation)
        return alert('Geolocation is not supported by your browser')

    navigator.geolocation.getCurrentPosition((position) => 
    {
        socket.emit('sendLocation', 
        {
            latitude : position.coords.latitude,
            longitude: position.coords.longitude
        }, 
        (error) => 
        {
            $sendLocationButton.removeAttribute('disabled');

            if (error)
                return console.log(error);
            
            console.log('Location shared!');
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error)
    {
        alert(error)
        location.href = '/'
    }
})