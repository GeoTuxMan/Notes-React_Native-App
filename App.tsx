import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; 

export default function App() {
  const [noteName, setNoteName] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [savedNotes, setSavedNotes] = useState<{[key: string]: string}>({});

  // incarcarea notitelor salvate la pornirea aplicatiei
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const notes = await AsyncStorage.getItem('savedNotes');
      if (notes !== null) {
        setSavedNotes(JSON.parse(notes));
      }
    } catch (e) {
      Alert.alert('Eroare', 'Nu am putut încărca notițele');
    }
  };

  const saveNote = async () => {
    if (!noteName.trim()) {
      Alert.alert('Eroare', 'Te rog să denumești notița');
      return;
    }

    try {
      const newNotes = {
        ...savedNotes,
        [noteName]: noteContent
      };
      
      await AsyncStorage.setItem('savedNotes', JSON.stringify(newNotes));
      setSavedNotes(newNotes);
      Alert.alert('Succes', 'Notița a fost salvată');
    } catch (e) {
      Alert.alert('Eroare', 'Nu am putut salva notița');
    }
  };

  const loadNote = (name: string) => {
    setNoteName(name);
    setNoteContent(savedNotes[name]);
  };

  const deleteNote = async (name: string) => {
    try {
      const newNotes = {...savedNotes};
      delete newNotes[name];
      
      await AsyncStorage.setItem('savedNotes', JSON.stringify(newNotes));
      setSavedNotes(newNotes);
      
      if (noteName === name) {
        setNoteName('');
        setNoteContent('');
      }
    } catch (e) {
      Alert.alert('Eroare', 'Nu am putut șterge notița');
    }
  };

  const clearCurrentNote = () => {
    setNoteName('');
    setNoteContent('');
  };

  return (
    <LinearGradient
      colors={['#e8f5e9', '#c8e6c9', '#a5d6a7']} // Nuanțe de verde
      style={styles.gradient}
    >
    <View style={styles.container}>
      <Text style={styles.title}>Editor Notițe</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Numele notiței"
        value={noteName}
        onChangeText={setNoteName}
      />
      
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="Scrie aici..."
        multiline
        value={noteContent}
        onChangeText={setNoteContent}
      />
      
      <View style={styles.buttonContainer}>        
        <TouchableOpacity onPress={saveNote} style={styles.deleteButton} activeOpacity={0.6}>
          <Ionicons name="add-circle" size={26} color="dodgerblue" />
        </TouchableOpacity>
        <View style={styles.buttonSpacer} />
        <TouchableOpacity onPress={clearCurrentNote} style={styles.deleteButton} activeOpacity={0.6}>
          <Ionicons name="trash" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.savedTitle}>Notițe salvate:</Text>
      <ScrollView style={styles.savedNotesContainer}>
        {Object.keys(savedNotes).length > 0 ? (
          Object.keys(savedNotes).map((name) => (
            <View key={name} style={styles.noteItem}>
              <Text 
                style={styles.noteName} 
                onPress={() => loadNote(name)}
              >
                {name}
              </Text>
              <TouchableOpacity onPress={() => deleteNote(name)} activeOpacity={0.6}>
                <Ionicons name="trash" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noNotesText}>Nu ai nicio notiță salvată</Text>
        )}
      </ScrollView>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:"dodgerblue"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  buttonSpacer: {
    width: 10,
  },
  savedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"dodgerblue"
  },
  savedNotesContainer: {
    flex: 1,
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 5,
  },
  noteName: {
    fontSize: 16,
    flex: 1,
  },
  noNotesText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});