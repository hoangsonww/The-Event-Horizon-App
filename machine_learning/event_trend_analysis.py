import pandas as pd
import matplotlib.pyplot as plt

data = {
    'event_name': ['Concert', 'Play', 'Sports Event', 'Concert', 'Play', 'Sports Event'],
    'event_date': ['2021-01-01', '2021-02-15', '2021-03-20', '2021-04-10', '2021-04-22', '2021-05-30'],
    'attendance': [200, 150, 250, 300, 180, 320]
}

df = pd.DataFrame(data)
df['event_date'] = pd.to_datetime(df['event_date'])
df.set_index('event_date', inplace=True)

# Trend Analysis
monthly_trends = df.groupby([df.index.month, 'event_name']).sum()

# Plotting
plt.figure(figsize=(10, 6))
for event in df['event_name'].unique():
    monthly_trends.xs(event, level=1)['attendance'].plot(label=event)

plt.title('Monthly Event Attendance Trends')
plt.xlabel('Month')
plt.ylabel('Total Attendance')
plt.legend()
plt.show()
