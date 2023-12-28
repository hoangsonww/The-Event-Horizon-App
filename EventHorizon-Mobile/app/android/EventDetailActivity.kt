package app.eventhorizon

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class EventDetailActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_event_detail)
        val eventId = intent.getSerializableExtra(EXTRA_EVENT_ID) as UUID
        loadEvent(eventId)
    }
}
