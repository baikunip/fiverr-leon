import pandas as pd
import datetime as dt
df=pd.read_csv('data/newDataConverted.csv')
dateAttr=['Registrierungsdatum der Einheit','Inbetriebnahmedatum der Einheit','Letzte Aktualisierung','Datum der endgültigen Stilllegung','Datum der geplanten Inbetriebnahme','Inbetriebnahmedatum der EEG-Anlage']

# for attr in dateAttr:
    # convert date to epoch
    # df[attr]=df[attr].fillna('1.1.1900')
    # df[attr]=pd.to_datetime(df[attr],format= '%d.%m.%Y')
    # df[attr]=df[attr].astype(int)/10**9
    # end of convert date to epoch

# get all name
hersteller=list(dict.fromkeys(df["Name des Anschluss-Netzbetreibers"].to_list()))
# for key in list(hersteller):
#     hersteller[key]=[]
for i, j in df.iterrows():
    objt={'MaStR-Nr. der Einheit':'','MaStR-Nr. der EEG-Anlage':'','EEG-Anlagenschlüssel':'','center':[]}
    objt['MaStR-Nr. der Einheit']=df['MaStR-Nr. der Einheit'][i]
    objt['MaStR-Nr. der EEG-Anlage']=df['MaStR-Nr. der EEG-Anlage'][i]
    objt['EEG-Anlagenschlüssel']=df['EEG-Anlagenschlüssel'][i]
    objt['center']=[df['latitude'][i],df['longitude'][i]]
    # if df["Hersteller der Windenergieanlage"][i] not in hersteller[df["Hersteller-Zusammenfassung"][i]]:
    #     hersteller[df["Hersteller-Zusammenfassung"][i]].append(df["Hersteller der Windenergieanlage"][i])
print(hersteller)
# print(hersteller)
# df.to_csv('newData27.09.csv')

