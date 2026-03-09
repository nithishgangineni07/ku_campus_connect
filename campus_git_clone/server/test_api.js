import axios from 'axios';

async function test() {
    try {
        // Just checking if backend is responding at all to group routes
        console.log("Checking groups...");
        const res = await axios.get('http://localhost:5000/groups');
        // This fails without token, but it's enough to get the server response
        console.log(res.status);
    } catch(e) {
        console.error(e.response ? e.response.status + ' ' + JSON.stringify(e.response.data) : e.message);
    }
}
test();
