package app.eventhorizon

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class EventListActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_event_list)
        loadEvents()
    }

    private fun loadEvents() {
        // Load events from the server
        server.getEvents { events ->
            // Update the UI
            updateUI(events)
        }
        return events
    }
}
