import Foundation

class EventDataManager {
    static let shared = EventDataManager()

    func fetchEvents(completion: @escaping ([Event]) -> Void) {
        let dummyEvents = [
            Event(name: "New Year's Eve", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Christmas", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Thanksgiving", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Halloween", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Independence Day", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Memorial Day", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Mother's Day", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Easter", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Valentine's Day", dateTime: Date(), description: "Celebration Event"),
            Event(name: "New Year's Day", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Christmas Eve", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Thanksgiving Eve", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Halloween Eve", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Independence Day Eve", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Memorial Day Eve", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Mother's Day Eve", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Easter Eve", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Valentine's Day Eve", dateTime: Date(), description: "Celebration Event"),
            Event(name: "New Year's Eve Eve", dateTime: Date(), description: "Celebration Event"),
            Event(name: "Christmas Eve Eve", dateTime: Date(), description: "Celebration Event"),
        ]
        completion(dummyEvents)
    }

    func createEvent(name: String, dateTime: Date, description: String) {
        let event = Event(name: name, dateTime: dateTime, description: description)
        database.events.append(event)
    }
}
