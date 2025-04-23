import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function NoteList({ notes, onSelect }) {
  return (
    <View style={styles.grid}>
      {notes.map((note) => (
        <TouchableOpacity
          key={note.id}
          style={[styles.card, { backgroundColor: '#fff' }]}
          onPress={() => onSelect(note)}
        >
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.content} numberOfLines={4}>
            {note.content}
          </Text>

          <View style={styles.categories}>
            {note.categories?.map((cat) => (
              <View
                key={cat.id}
                style={[styles.catDot, { backgroundColor: cat.color || '#ccc' }]}
              />
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '100%',
    maxWidth: 180,
    borderRadius: 10,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  categories: {
    flexDirection: 'row',
    gap: 4,
  },
  catDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
