package app.eventhorizon

import java.util.*

data class Event(
    val id: UUID = UUID.randomUUID(),
    val name: String,
    val dateTime: Date,
    val description: String
)
