
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [tickets, setTickets] = useState(1)
  const [message, setMessage] = useState('')

  async function fetchMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('id')

    if (error) {
      console.error(error.message)
      setMessage(error.message)
    } else {
      setMatches(data)
    }

    setLoading(false)
  }

  async function bookTicket(match) {
    const count = Number(tickets)

    if (!customerName.trim() || !email.trim()) {
      setMessage('Please enter your name and email.')
      return
    }

    if (!Number.isInteger(count) || count < 1) {
      setMessage('Enter a valid ticket quantity.')
      return
    }

    if (count > match.available_seats) {
      setMessage('Not enough seats available.')
      return
    }

    const { error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        match_id: match.id,
        customer_name: customerName,
        email: email,
        tickets: count
      }])

    if (bookingError) {
      setMessage(bookingError.message)
      return
    }

    const { error: updateError } = await supabase
      .from('matches')
      .update({
        available_seats: match.available_seats - count
      })
      .eq('id', match.id)

    if (updateError) {
      setMessage('Seat update failed: ' + updateError.message)
      return
    }

    setMessage('Booking successful!')
    fetchMatches()
  }

  useEffect(() => {
    fetchMatches()

    const channel = supabase
      .channel('matches-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        () => fetchMatches()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div>
      <h1>IPL Ticket Booking</h1>

      <input
        placeholder="Your Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <input
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="number"
        min="1"
        value={tickets}
        onChange={(e) => setTickets(e.target.value)}
      />

      <p>{message}</p>

      {loading ? (
        <p>Loading matches...</p>
      ) : matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        matches.map((match) => (
          <div key={match.id}>
            <h2>{match.team1} vs {match.team2}</h2>
            <p>Venue: {match.venue}</p>
            <p>Ticket Price: ₹{match.ticket_price}</p>
            <p>Available Seats: {match.available_seats}</p>

            <button onClick={() => bookTicket(match)}>
              Book Ticket
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default App
