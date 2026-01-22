import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Button,
  Searchbar,
  ActivityIndicator,
  Surface,
  Divider,
} from 'react-native-paper';
import { apiService } from '../services/api';
import { Menu, MenuItem, MenuCategory } from '../types';

interface MenuDisplayProps {
  restaurantId: string;
  onItemPress?: (item: MenuItem, category: MenuCategory) => void;
}

export default function MenuDisplay({ restaurantId, onItemPress }: MenuDisplayProps) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [popularItems, setPopularItems] = useState<any[]>([]);

  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal'];

  useEffect(() => {
    loadMenus();
    loadPopularItems();
  }, [restaurantId]);

  useEffect(() => {
    if (searchQuery || selectedCategory || selectedDietary.length > 0) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedCategory, selectedDietary]);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMenusByRestaurant(restaurantId);
      setMenus(data);
    } catch (error) {
      console.error('Error loading menus:', error);
      Alert.alert('Error', 'Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  const loadPopularItems = async () => {
    try {
      const data = await apiService.getPopularItems(restaurantId, 5);
      setPopularItems(data);
    } catch (error) {
      console.error('Error loading popular items:', error);
    }
  };

  const performSearch = async () => {
    try {
      const results = await apiService.searchMenuItems(
        restaurantId,
        searchQuery,
        selectedCategory || undefined,
        selectedDietary.length > 0 ? selectedDietary : undefined
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching menu items:', error);
    }
  };

  const toggleDietary = (dietary: string) => {
    setSelectedDietary(prev =>
      prev.includes(dietary)
        ? prev.filter(d => d !== dietary)
        : [...prev, dietary]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedDietary([]);
  };

  const renderMenuItem = (item: MenuItem, category: MenuCategory, menuName?: string) => (
    <TouchableOpacity
      key={item._id}
      onPress={() => onItemPress?.(item, category)}
      style={styles.menuItem}
    >
      <Card style={styles.itemCard}>
        <Card.Content style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <View style={styles.itemInfo}>
              <Title style={styles.itemName}>{item.name}</Title>
              <Paragraph style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Paragraph>
              {menuName && (
                <Text style={styles.menuName}>from {menuName}</Text>
              )}
            </View>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.itemImage} />
            )}
          </View>

          <View style={styles.itemDetails}>
            <Text style={styles.price}>฿{item.price.toFixed(2)}</Text>
            
            {item.preparationTime && (
              <Chip icon="clock-outline" compact style={styles.chip}>
                {item.preparationTime} min
              </Chip>
            )}
            
            {item.spicyLevel && item.spicyLevel > 0 && (
              <Chip icon="chili-hot" compact style={styles.chip}>
                {'🌶️'.repeat(item.spicyLevel)}
              </Chip>
            )}
          </View>

          {item.dietaryInfo && item.dietaryInfo.length > 0 && (
            <View style={styles.dietaryInfo}>
              {item.dietaryInfo.map((diet, index) => (
                <Chip key={index} compact style={styles.dietaryChip}>
                  {diet}
                </Chip>
              ))}
            </View>
          )}

          {item.allergens && item.allergens.length > 0 && (
            <View style={styles.allergens}>
              <Text style={styles.allergensLabel}>Allergens: </Text>
              <Text style={styles.allergensText}>{item.allergens.join(', ')}</Text>
            </View>
          )}

          {!item.isAvailable && (
            <View style={styles.unavailable}>
              <Text style={styles.unavailableText}>Currently Unavailable</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderCategory = (category: MenuCategory, menuName: string) => (
    <View key={category._id} style={styles.category}>
      <Surface style={styles.categoryHeader}>
        <Title style={styles.categoryName}>{category.name}</Title>
        {category.description && (
          <Paragraph style={styles.categoryDescription}>
            {category.description}
          </Paragraph>
        )}
      </Surface>
      
      <View style={styles.categoryItems}>
        {category.items
          .filter(item => item.isAvailable)
          .map(item => renderMenuItem(item, category))}
      </View>
    </View>
  );

  const getAllCategories = () => {
    const categories = new Set<string>();
    menus.forEach(menu => {
      menu.categories.forEach(category => {
        if (category.isActive) {
          categories.add(category.name);
        }
      });
    });
    return Array.from(categories);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  if (menus.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No menu available for this restaurant</Text>
        <Button mode="outlined" onPress={loadMenus}>
          Retry
        </Button>
      </View>
    );
  }

  const categories = getAllCategories();
  const hasFilters = searchQuery || selectedCategory || selectedDietary.length > 0;
  const displayResults = hasFilters ? searchResults : [];

  return (
    <ScrollView style={styles.container}>
      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <Searchbar
          placeholder="Search menu items..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          <Chip
            selected={selectedCategory === null}
            onPress={() => setSelectedCategory(null)}
            style={styles.filterChip}
          >
            All Categories
          </Chip>
          {categories.map(category => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.filterChip}
            >
              {category}
            </Chip>
          ))}
        </ScrollView>

        {/* Dietary Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {dietaryOptions.map(dietary => (
            <Chip
              key={dietary}
              selected={selectedDietary.includes(dietary)}
              onPress={() => toggleDietary(dietary)}
              style={styles.filterChip}
            >
              {dietary}
            </Chip>
          ))}
        </ScrollView>

        {hasFilters && (
          <Button mode="outlined" onPress={clearFilters} style={styles.clearButton}>
            Clear Filters
          </Button>
        )}
      </View>

      {/* Popular Items */}
      {!hasFilters && popularItems.length > 0 && (
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>Popular Items</Title>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularItems.map((item, index) => (
              <View key={index} style={styles.popularItem}>
                {renderMenuItem(item.item, { name: item.categoryName } as MenuCategory, item.menuName)}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Search Results */}
      {hasFilters && (
        <View style={styles.section}>
          <Title style={styles.sectionTitle}>
            Search Results ({displayResults.length})
          </Title>
          {displayResults.map((result, index) => (
            <View key={index}>
              {renderMenuItem(result.item, { name: result.categoryName } as MenuCategory, result.menuName)}
            </View>
          ))}
        </View>
      )}

      {/* Full Menu */}
      {!hasFilters && (
        <View style={styles.section}>
          {menus.map(menu => (
            <View key={menu._id} style={styles.menu}>
              <Title style={styles.menuTitle}>{menu.name}</Title>
              {menu.description && (
                <Paragraph style={styles.menuDescription}>
                  {menu.description}
                </Paragraph>
              )}
              <Divider style={styles.divider} />
              
              {menu.categories
                .filter(category => category.isActive)
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map(category => renderCategory(category, menu.name))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchbar: {
    marginBottom: 10,
  },
  filterRow: {
    marginBottom: 10,
  },
  filterChip: {
    marginRight: 8,
  },
  clearButton: {
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  popularItem: {
    width: 280,
    marginLeft: 16,
  },
  menu: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  menuTitle: {
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuDescription: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  divider: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  category: {
    marginBottom: 20,
  },
  categoryHeader: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    elevation: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
  },
  categoryItems: {
    paddingHorizontal: 16,
  },
  menuItem: {
    marginBottom: 10,
  },
  itemCard: {
    elevation: 2,
  },
  itemContent: {
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  menuName: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginRight: 10,
  },
  chip: {
    marginRight: 5,
  },
  dietaryInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  dietaryChip: {
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#E8F5E8',
  },
  allergens: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  allergensLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  allergensText: {
    fontSize: 12,
    color: '#FF9800',
  },
  unavailable: {
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  unavailableText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
});