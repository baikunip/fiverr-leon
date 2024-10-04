import pandas as pd
import datetime as dt
df=pd.read_csv('data/newData.csv')
dateAttr=['Registrierungsdatum der Einheit','Inbetriebnahmedatum der Einheit','Letzte Aktualisierung','Datum der endgültigen Stilllegung','Datum der geplanten Inbetriebnahme','Inbetriebnahmedatum der EEG-Anlage']
for attr in dateAttr:
    df[attr]=df[attr].fillna('1.1.1900')
    df[attr]=pd.to_datetime(df[attr],format= '%d.%m.%Y')
    # df['newDate']=df['newDate'].fillna('1.1.1900')
    df[attr]=int(df[attr].astype('int64')/10**9)
# df['newDate']=(df['newDate'] - dt.datetime(1970,1,1)).dt.total_seconds()
df.to_csv('newDataConverted.csv')

