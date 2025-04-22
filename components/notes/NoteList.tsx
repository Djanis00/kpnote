import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NoteList({ notes, onSelect }) {
  if (!notes.length) return <Text>Aucune note à afficher</Text>;

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onSelect(item)}
          style={styles.card}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.content} numberOfLines={4}>
            {item.content}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  content: {
    color: '#555',
  },
});
