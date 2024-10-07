import pandas as pd
import datetime as dt
df=pd.read_csv('/Users/kuni/Library/Mobile Documents/com~apple~CloudDocs/Documents/GitHub/fiverr-leon/data/Data27.09.csv')
dateAttr=['Registrierungsdatum der Einheit','Inbetriebnahmedatum der Einheit','Letzte Aktualisierung','Datum der endgültigen Stilllegung','Datum der geplanten Inbetriebnahme','Inbetriebnahmedatum der EEG-Anlage']

# for attr in dateAttr:
    # convert date to epoch
    # df[attr]=df[attr].fillna('1.1.1900')
    # df[attr]=pd.to_datetime(df[attr],format= '%d.%m.%Y')
    # df[attr]=df[attr].astype(int)/10**9
    # end of convert date to epoch

# get all name
hersteller=dict.fromkeys(df["Hersteller-Zusammenfassung"].to_list())
for key in list(hersteller):
    hersteller[key]=[]
# print(dict.fromkeys(df["Hersteller der Windenergieanlage"].to_list()))
for i, j in df.iterrows():
    if df["Hersteller der Windenergieanlage"][i] not in hersteller[df["Hersteller-Zusammenfassung"][i]]:
        hersteller[df["Hersteller-Zusammenfassung"][i]].append(df["Hersteller der Windenergieanlage"][i])
    # print(df["Hersteller der Windenergieanlage"][i])
print(hersteller)
# print(hersteller)
# df.to_csv('newData27.09.csv')

