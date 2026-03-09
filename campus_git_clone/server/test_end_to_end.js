const emailAdmin = "testadmin2@exampler.com";
const pwd = "Password123!";

async function run() {
    const fetch = globalThis.fetch;
    const base = 'http://localhost:5000';
    try {
        // Register Admin
        let res = await fetch(base + '/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name: 'Admin', email: emailAdmin, password: pwd, role: 'admin', department: 'CS' })
        });
        if (!res.ok && res.status !== 400 && res.status !== 500) {
            console.error("Register admin err", await res.text());
        }
        
        // Login Admin
        res = await fetch(base + '/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: emailAdmin, password: pwd })
        });
        const adminData = await res.json();
        const adminToken = adminData.token;
        const adminId = adminData.user._id;

        // Register Student
        const emailStudent = "testst2@exampler.com";
        res = await fetch(base + '/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name: 'Student', email: emailStudent, password: pwd, role: 'student', rollNumber: '1256789012', department: 'CS' })
        });
        
        res = await fetch(base + '/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: emailStudent, password: pwd })
        });
        const studentData = await res.json();
        const studentToken = studentData.token;
        const studentId = studentData.user._id;

        // Admin Creates Group
        res = await fetch(base + '/groups', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}`},
            body: JSON.stringify({ name: 'Groupss', description: 'Desc group', privacy: 'public', creatorId: adminId })
        });
        const groupData = await res.json();
        const groupId = groupData._id;

        // Student joins Group
        res = await fetch(base + `/groups/${groupId}/join`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${studentToken}`},
            body: JSON.stringify({ userId: studentId })
        });
        let joinRes = await res.json();
        console.log("After Join: pending members:", joinRes.pendingMembers);

        // Admin Approves Student
        res = await fetch(base + `/groups/${groupId}/approve`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}`},
            body: JSON.stringify({ userId: studentId })
        });
        console.log("Approve status:", res.status);
        if(!res.ok) console.log("Approve err:", await res.text());
        else {
            let appRes = await res.json();
            console.log("After Approve: pending:", appRes.pendingMembers, "members:", appRes.members.some(m => m._id === studentId));
        }

    } catch (e) {
        console.error(e);
    }
}
run();
