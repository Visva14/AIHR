import spacy
nlp = spacy.load('en_core_web_trf')
doc = nlp('Visvajit Kumar\nvisvajit1407@gmail.com\nAbout Me\nSkills: Python, Java')
for ent in doc.ents:
    print(ent.text, ent.label_)
