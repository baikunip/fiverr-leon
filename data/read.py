import pandas as pd
import datetime as dt
import json
df=pd.read_csv('data/NewData-wY.csv')
dateAttr=['Registrierungsdatum der Einheit','Inbetriebnahmedatum der Einheit','Letzte Aktualisierung','Datum der endgültigen Stilllegung','Datum der geplanten Inbetriebnahme','Inbetriebnahmedatum der EEG-Anlage']

for attr in dateAttr:
    # convert date to epoch
    df[attr]=df[attr].fillna('1.1.1900')
    df[attr]=pd.to_datetime(df[attr],format= '%d.%m.%Y')
    df[attr]=df[attr].astype('int64')/10**9
    # end of convert date to epoch
for j in df:
    if(j not in dateAttr):
        df[j]=df[j].fillna(0)
# get all name
# hersteller=list(dict.fromkeys(df["Name des Anschluss-Netzbetreibers"].to_list()))
# for key in list(hersteller):
#     hersteller[key]=[]
# jsData=[]
# for i, j in df.iterrows():
#     objt={'MaStR-Nr. der Einheit':'','MaStR-Nr. der EEG-Anlage':'','EEG-Anlagenschlüssel':'','center':[]}
#     objt['MaStR-Nr. der Einheit']=df['MaStR-Nr. der Einheit'][i]
#     objt['MaStR-Nr. der EEG-Anlage']=df['MaStR-Nr. der EEG-Anlage'][i]
#     objt['EEG-Anlagenschlüssel']=df['EEG-Anlagenschlüssel'][i]
#     objt['center']=[df['longitude'][i],df['latitude'][i]]
#     jsData.append(objt)
    # if df["Hersteller der Windenergieanlage"][i] not in hersteller[df["Hersteller-Zusammenfassung"][i]]:
    #     hersteller[df["Hersteller-Zusammenfassung"][i]].append(df["Hersteller der Windenergieanlage"][i])
# Serializing json
# json_object = json.dumps(jsData, indent=4)
# with open("search.json", "w") as outfile:
#     outfile.write(json_object)
# print(hersteller)
df.to_csv('NewData-wY-converted.csv')

