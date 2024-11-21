document.addEventListener('DOMContentLoaded', () => {
        
    // Manipulador para adicionar livro
    document.getElementById('addBookForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const numberFour = document.getElementById('numberFour').value;
        const guestName  = document.getElementById('guestName').value;
        const entryDate  = document.getElementById('entryDate').value;
        const dateExit   = document.getElementById('dateExit').value;

        const response   = await fetch('/api/hotel/makeBooking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numberFour, guestName, entryDate, dateExit })
        });

        if (response.status === 201) {
            const booking = await response.json();
            console.log('Livro adicionado:', booking);
            document.getElementById('addBookForm').reset(); // Limpar campos do formulário
        } else {
            const error = await response.json();
            alert(error.message);
        }

        getAllBookings();
    });

    // Manipulador para realizar reserva
    const checkRoomAvailability = document.getElementById('checkRoomAvailability');
    console.log(checkRoomAvailability);              
    if (checkRoomAvailability) {
        checkRoomAvailability.addEventListener('submit', async (event) => {
        event.preventDefault();

        const numberFour = document.getElementById('cra-numberFour').value;
        const entryDate = document.getElementById('cra-entryDate').value;
        const dateExit = document.getElementById('cra-dateExit').value;

        if (!numberFour || !entryDate || !dateExit) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        if (new Date(entryDate) >= new Date(dateExit)) {
            alert("A data de entrada deve ser anterior à data de saída.");
            return;
        }

        const response = await fetch(`/api/hotel/checkRoomAvailability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numberFour, entryDate, dateExit })
        });

        switch (response.status) {
            case 200:
                alert('Quarto disponível');
                break;
            case 404:
                alert('Quarto não encontrado');
                break;
            case 409:
                alert('Quarto não disponível');
                break;
            default:
                alert('Erro desconhecido');
        }

        checkRoomAvailability.reset();
            getAllBookings();
        });
    }

    // Manipulador para cancelar reserva
    const returnForm = document.getElementById('cancelBookingForm');
    if (returnForm) {
        returnForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const bookingId = document.getElementById('cbf-bookingId').value;

            const response = await fetch(`/api/hotel/cancelBooking/${bookingId}`, {
                method: 'DELETE'
            });
            if (response.status === 200) {
                alert('Cancelamento realizado');
                returnForm.reset();
            } else if (response.status === 404) {
                alert('Quarto não encontrado');
            } else {
                alert('Erro ao registrar devolução');
            }
            getAllBookings();
        });
    }
    
    // Referência ao corpo da tabela
    const booksList = document.getElementById('booksList');

    // Função para carregar as reservas e exibir na tabela
    async function getAllBookings() {
        try {
            const response = await fetch('/api/hotel/getAllBookings');
            const data = await response.json();

            if (response.ok && data.bookings) {
                booksList.innerHTML = ''; // Limpar tabela antes de preencher

                data.bookings.forEach(booking => {
                    // Formatando as datas para exibir apenas dia/mês/ano
                    const entryDate = new Date(booking.entryDate).toLocaleDateString();
                    const dateExit = new Date(booking.dateExit).toLocaleDateString();

                    // Criar uma nova linha para cada reserva
                    const row = `
                        <tr>
                            <td>${booking.id}</td>
                            <td>${booking.numberFour}</td>
                            <td>${booking.guestName}</td>
                            <td>${entryDate}</td>
                            <td>${dateExit}</td>
                        </tr>
                    `;
                    booksList.innerHTML += row; // Adicionar a linha à tabela
                });
            } else {
                booksList.innerHTML = `<tr><td colspan="5">Nenhuma reserva encontrada.</td></tr>`;
            }
        } catch (error) {
            console.error("Erro ao carregar reservas:", error);
            booksList.innerHTML = `<tr><td colspan="5">Erro ao carregar reservas.</td></tr>`;
        }
    }

    // Carregar as reservas ao carregar a página
    document.addEventListener('DOMContentLoaded', getAllBookings);

});