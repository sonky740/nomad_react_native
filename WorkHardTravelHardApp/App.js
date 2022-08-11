import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { theme } from './colors';

const STORAGE_KEY = '@toDos';

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);

  const onChangeText = (payload) => setText(payload);

  const saveTodos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      throw new Error(error.message || '저장 못함');
    }
  };

  const addTodo = async () => {
    if (text === '') return;
    const newToDos = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDos);
    await saveTodos(newToDos);
    setText('');
  };

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
    } catch (error) {
      throw new Error(error.message || '못 불러옴');
    }
  };

  useEffect(() => {
    loadToDos();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? '#fff' : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? 'white' : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder={working ? 'Add a To Do' : 'Where do you want to go?'}
        placeholderTextColor={theme.grey}
        onChangeText={onChangeText}
        onSubmitEditing={addTodo}
        value={text}
        returnKeyType="done"
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: 'space-between',
    marginTop: 100,
    flexDirection: 'row',
  },
  btnText: {
    fontSize: 38,
    fontWeight: '600',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  toDoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
