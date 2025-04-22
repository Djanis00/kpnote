import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TaskList({ tasks, onSelect }) {
  if (!tasks.length) return <Text>Aucune tâche à afficher</Text>;

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onSelect(item)}
          style={styles.card}
        >
          <Text
            style={[
              styles.title,
              item.completed && { textDecorationLine: 'line-through', color: '#999' },
            ]}
          >
            {item.description}
          </Text>
          <Text style={styles.status}>
            {item.completed ? '✅ Complétée' : '⏳ En cours'}
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
  },
  status: {
    marginTop: 8,
    color: '#555',
    fontSize: 13,
  },
});
