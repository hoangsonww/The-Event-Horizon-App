package app.eventhorizon

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class CreateEventActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_event)
    }

    private fun createEvent() {
        val eventName = "" // Get from UI
        val eventDateTime = Date() // Get from UI
        val eventDescription = "" // Get from UI

        val event = Event(
            name = eventName,
            dateTime = eventDateTime,
            description = eventDescription
        )

        server.createEvent(event) { eventId ->
            navigateToEventDetail(eventId)
        }

        return event
    }
}
