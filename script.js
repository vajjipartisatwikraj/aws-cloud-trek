document.addEventListener('DOMContentLoaded', function() {
    const studentForm = document.getElementById('studentForm');
    const refreshBtn = document.getElementById('refreshBtn');
    const studentsTable = document.getElementById('studentsTable');
    const notification = document.getElementById('notification');

    // Load students on page load
    loadStudents();

    // Form submission
    studentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(studentForm);
        const studentData = {
            name: formData.get('name'),
            email: formData.get('email'),
            course: formData.get('course'),
            phone: formData.get('phone')
        };

        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'add_student',
                    data: studentData
                })
            });

            const result = await response.json();
            
            if (result.success) {
                showNotification('Student added successfully!', 'success');
                studentForm.reset();
                loadStudents();
            } else {
                showNotification('Error: ' + result.message, 'error');
            }
        } catch (error) {
            showNotification('Network error occurred', 'error');
            console.error('Error:', error);
        }
    });

    // Refresh button
    refreshBtn.addEventListener('click', function() {
        loadStudents();
    });

    // Load students function
    async function loadStudents() {
        studentsTable.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Loading students...</div>';
        
        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'get_students'
                })
            });

            const result = await response.json();
            
            if (result.success) {
                displayStudents(result.data);
            } else {
                studentsTable.innerHTML = '<div class="loading">Error loading students: ' + result.message + '</div>';
            }
        } catch (error) {
            studentsTable.innerHTML = '<div class="loading">Network error occurred</div>';
            console.error('Error:', error);
        }
    }

    // Display students in table
    function displayStudents(students) {
        if (students.length === 0) {
            studentsTable.innerHTML = '<div class="loading">No students registered yet</div>';
            return;
        }

        let tableHTML = `
            <table class="students-table">
                <thead>
                    <tr>
                        <th><i class="fas fa-hashtag"></i> ID</th>
                        <th><i class="fas fa-user"></i> Name</th>
                        <th><i class="fas fa-envelope"></i> Email</th>
                        <th><i class="fas fa-graduation-cap"></i> Course</th>
                        <th><i class="fas fa-phone"></i> Phone</th>
                        <th><i class="fas fa-calendar"></i> Registered</th>
                    </tr>
                </thead>
                <tbody>
        `;

        students.forEach(student => {
            const registeredDate = new Date(student.created_at).toLocaleDateString();
            tableHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${escapeHtml(student.name)}</td>
                    <td>${escapeHtml(student.email)}</td>
                    <td>${escapeHtml(student.course)}</td>
                    <td>${escapeHtml(student.phone)}</td>
                    <td>${registeredDate}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        studentsTable.innerHTML = tableHTML;
    }

    // Show notification
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
});
